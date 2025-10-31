/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { SelectButton } from 'primereact/selectbutton';

import './login.scss';
import { GoogleLogin } from '@react-oauth/google';
import { Divider } from 'primereact/divider';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { endpoints } from '@/lib/constants/endpoints';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { decodeJWT } from '@/lib/utils/getDataFromToken';
import { Dialog } from 'primereact/dialog';
import Link from 'next/link';
import AppFooter from '@/layout/AppFooter';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { auth } from '@/lib/firebase/client';
import {
    ConfirmationResult,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    signOut
} from 'firebase/auth';

type LoginInputs = {
    email: string;
    password?: string;
    phone?: string;
    otp?: string;
};

const LoginPage = () => {
    const [checked, setChecked] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false);
    const [userChecked, setUserChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const options = ['Buyer', 'Seller'];
    const [modalVisible, setModalVisible] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const userType = searchParams.get('userType');
    const authType = searchParams.get('authType');
    const [value, setValue] = useState(userType || options[0]);
    const [authTypeValue, setAuthTypeValue] = useState<'email' | 'phone'>((authType as 'email' | 'phone') || 'phone');
    const [defaultCountry, setDefaultCountry] = useState('in');
    const [otpSent, setOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [phoneIdToken, setPhoneIdToken] = useState<string | null>(null);
    const [formattedPhone, setFormattedPhone] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const buyerDomain = process.env.NEXT_PUBLIC_BUYER_DOMAIN;

    const {
        control,
        handleSubmit,
        watch,
        setError,
        setValue: setFormValue,
        reset,
        formState: { errors }
    } = useForm<LoginInputs>({
        defaultValues: {
            email: '',
            password: '',
            phone: '',
            otp: ''
        }
    });

    const phoneValue = watch('phone');
    const otpValue = watch('otp');
    const emailValue = watch('email');

    useEffect(() => {
        let isActive = true;
        const fetchCountry = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/');
                if (!response.ok) return;
                const data = await response.json();
                if (data?.country_code && isActive) {
                    setDefaultCountry(data.country_code.toLowerCase());
                }
            } catch (error) {
                // ignore failures and keep default
            }
        };
        fetchCountry();
        return () => {
            isActive = false;
        };
    }, []);

    const social = useMutation({
        mutationFn: (data: any) => {
            return axios.post(endpoints.socialLogin, data);
        },
        onMutate: () => {
            toast.loading('Please Wait...', { id: 'login-loading' });
        },
        onSuccess: (data) => {
            toast.dismiss('login-loading');
            toast.success(data.data.message);
            if (value === 'Buyer') {
                router.push(
                    `${buyerDomain}api/login?token=${data.data.token}&newUser=${
                        data.data.newUser
                    }&from=${searchParams.get('from') || ''}`
                );
                return;
            }
            if (data.data.newUser) {
                router.push('/onboarding');
            } else {
                router.push('/');
            }
        },
        onError: (error: any) => {
            toast.dismiss('login-loading');
            toast.error(error.response?.data?.message || 'Something went wrong');
        }
    });

    const checkUserMutation = useMutation({
        mutationFn: (payload: any) => axios.post(endpoints.checkUser, payload)
    });

    const loginMutation = useMutation({
        mutationFn: (payload: any) => axios.post(endpoints.login, payload)
    });

    const registerMutation = useMutation({
        mutationFn: (payload: any) => axios.post(endpoints.register, payload)
    });

    const parsePhone = (raw?: string | null) => {
        if (!raw) return null;
        const normalized = raw.startsWith('+') ? raw : `+${raw}`;
        const parsed = parsePhoneNumberFromString(normalized);
        if (parsed?.isValid()) {
            return parsed.number;
        }
        return null;
    };

    const phoneError = useMemo(() => {
        if (!phoneValue) return 'Phone number required';
        const parsed = parsePhone(phoneValue);
        return parsed ? undefined : 'Invalid phone number';
    }, [phoneValue]);

    const resetPhoneFlow = () => {
        setOtpSent(false);
        setIsOtpVerified(false);
        setConfirmationResult(null);
        setPhoneIdToken(null);
        setFormattedPhone('');
        setFormValue('otp', '');
    };

    const ensureRecaptcha = async () => {
        if (typeof window === 'undefined') return null;
        if (recaptchaVerifierRef.current) {
            recaptchaVerifierRef.current.clear();
            recaptchaVerifierRef.current = null;
        }
        const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible'
        });
        recaptchaVerifierRef.current = verifier;
        await verifier.render();
        return verifier;
    };

    const redirectUser = (token: string, newUser: boolean) => {
        if (!token) return;
        if (value === 'Buyer') {
            router.push(
                `${buyerDomain}api/login?token=${token}&newUser=${newUser}&from=${searchParams.get('from') || ''}`
            );
            return;
        }
        if (newUser) {
            router.push('/onboarding');
        } else {
            router.push(`/api/auth/login?token=${token}`);
        }
    };

    const handleAuthResponse = (responseData: any, overrideNewUser?: boolean) => {
        const newUserFlag =
            typeof overrideNewUser === 'boolean' ? overrideNewUser : responseData?.isNewUser || false;
        const token = responseData?.token;
        const message = responseData?.message;
        if (message) {
            toast.success(message);
        }
        if (token) {
            redirectUser(token, newUserFlag);
        }
    };

    const handlePhoneSubmit = async (data: LoginInputs, e164Phone: string) => {
        if (!otpSent) {
            setIsProcessing(true);
            toast.loading('Sending OTP...', { id: 'login-loading' });
            try {
                const response = await checkUserMutation.mutateAsync({ phone: e164Phone });
                setIsNewUser(response.data.isNewUser);
                const verifier = await ensureRecaptcha();
                if (!verifier) {
                    throw new Error('Unable to initialise phone verification.');
                }
                const confirmation = await signInWithPhoneNumber(auth, e164Phone, verifier);
                setConfirmationResult(confirmation);
                setOtpSent(true);
                setFormattedPhone(e164Phone);
                toast.success('OTP sent successfully');
            } catch (error: any) {
                toast.error(error?.response?.data?.message || error?.message || 'Unable to send OTP');
                resetPhoneFlow();
            } finally {
                toast.dismiss('login-loading');
                setIsProcessing(false);
            }
            return;
        }

        if (!isOtpVerified) {
            if (!otpValue) {
                setError('otp', { message: 'Enter the OTP sent to your phone.' });
                toast.error('Enter the OTP sent to your phone.');
                return;
            }
            if (!confirmationResult) {
                toast.error('Verification session expired. Please resend the OTP.');
                resetPhoneFlow();
                return;
            }
            setIsProcessing(true);
            toast.loading('Verifying OTP...', { id: 'login-loading' });
            try {
                const credential = await confirmationResult.confirm(otpValue);
                const idToken = await credential.user.getIdToken();
                await signOut(auth);
                setPhoneIdToken(idToken);
                setIsOtpVerified(true);
                setFormValue('otp', '');
                if (!isNewUser) {
                    const response = await loginMutation.mutateAsync({
                        phone: e164Phone,
                        firebaseIdToken: idToken
                    });
                    handleAuthResponse(response.data, false);
                    resetPhoneFlow();
                } else {
                    toast.success('Phone number verified. Please complete your registration.');
                    setUserChecked(true);
                }
            } catch (error: any) {
                toast.error(error?.response?.data?.message || error?.message || 'Invalid OTP');
            } finally {
                toast.dismiss('login-loading');
                setIsProcessing(false);
            }
            return;
        }

        if (isNewUser) {
            if (!data.email) {
                setError('email', { message: 'Email is required.' });
                toast.error('Email is required.');
                return;
            }
            if (!data.password) {
                setError('password', { message: 'Password is required.' });
                toast.error('Password is required.');
                return;
            }
            setIsProcessing(true);
            toast.loading('Creating your account...', { id: 'login-loading' });
            try {
                const response = await registerMutation.mutateAsync({
                    email: data.email,
                    password: data.password,
                    userType: value,
                    phone: e164Phone,
                    firebaseIdToken: phoneIdToken
                });
                handleAuthResponse(response.data, true);
                resetPhoneFlow();
            } catch (error: any) {
                toast.error(error?.response?.data?.message || error?.message || 'Registration failed');
            } finally {
                toast.dismiss('login-loading');
                setIsProcessing(false);
            }
        }
    };

    const handleEmailSubmit = async (data: LoginInputs) => {
        if (!data.email) {
            setError('email', { message: 'Email is required.' });
            toast.error('Email is required.');
            return;
        }

        if (!userChecked) {
            setIsProcessing(true);
            toast.loading('Checking account...', { id: 'login-loading' });
            try {
                const response = await checkUserMutation.mutateAsync({ email: data.email });
                setIsNewUser(response.data.isNewUser);
                setUserChecked(true);
                toast.success(response.data.message);
            } catch (error: any) {
                toast.error(error?.response?.data?.message || error?.message || 'Unable to validate user');
            } finally {
                toast.dismiss('login-loading');
                setIsProcessing(false);
            }
            return;
        }

        if (isNewUser) {
            const parsedPhone = parsePhone(phoneValue);
            if (!parsedPhone) {
                setError('phone', { message: 'Valid phone number is required.' });
                toast.error('Valid phone number is required.');
                return;
            }
            if (!data.password) {
                setError('password', { message: 'Password is required.' });
                toast.error('Password is required.');
                return;
            }
            setIsProcessing(true);
            toast.loading('Creating your account...', { id: 'login-loading' });
            try {
                const response = await registerMutation.mutateAsync({
                    email: data.email,
                    password: data.password,
                    phone: parsedPhone,
                    userType: value
                });
                handleAuthResponse(response.data, true);
            } catch (error: any) {
                toast.error(error?.response?.data?.message || error?.message || 'Registration failed');
            } finally {
                toast.dismiss('login-loading');
                setIsProcessing(false);
            }
            return;
        }

        if (!data.password) {
            setError('password', { message: 'Password is required.' });
            toast.error('Password is required.');
            return;
        }
        setIsProcessing(true);
        toast.loading('Signing you in...', { id: 'login-loading' });
        try {
            const response = await loginMutation.mutateAsync({
                email: data.email,
                password: data.password
            });
            handleAuthResponse(response.data, false);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message || 'Login failed');
        } finally {
            toast.dismiss('login-loading');
            setIsProcessing(false);
        }
    };

    const onSubmit: SubmitHandler<LoginInputs> = async (data: LoginInputs) => {
        if (authTypeValue === 'phone') {
            const parsedPhone = parsePhone(data.phone);
            if (!parsedPhone) {
                setError('phone', { message: 'Valid phone number is required.' });
                toast.error('Please enter a valid phone number.');
                return;
            }
            await handlePhoneSubmit(data, parsedPhone);
            return;
        }
        await handleEmailSubmit(data);
    };

    const containerClassName = classNames(
        'surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden',
        { 'p-input-filled': layoutConfig.inputStyle === 'filled' }
    );

    const showPasswordField =
        (authTypeValue === 'email' && userChecked) || (authTypeValue === 'phone' && isNewUser && isOtpVerified);

    const showRememberMe = authTypeValue === 'email' && userChecked && !isNewUser;

    const showTermsAndConditions =
        (authTypeValue === 'email' && userChecked && isNewUser) ||
        (authTypeValue === 'phone' && isNewUser && isOtpVerified);

    const forgotPass = useMutation({
        mutationFn: (data: any) => {
            return axios.post(endpoints.forgotPassword, data);
        },
        onSuccess: (data) => {
            toast.success(data.data.message);
            setModalVisible(false);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to send reset email');
        }
    });

    const forgotPassFooterContent = (
        <div>
            <Button
                label="No"
                icon="pi pi-times"
                onClick={() => setModalVisible(false)}
                className="p-button-text"
            />
            <Button
                loading={forgotPass.isPending}
                label="Yes"
                icon="pi pi-check"
                onClick={() => forgotPass.mutate({ email: emailValue })}
                autoFocus
            />
        </div>
    );

    const passwordHeader = <h6>Pick a password</h6>;
    const passwordFooter = (
        <React.Fragment>
            <Divider />
            <p className="mt-2">Suggestions</p>
            <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: '1.5' }}>
                <li>At least one lowercase</li>
                <li>At least one uppercase</li>
                <li>At least one numeric</li>
                <li>Minimum 8 characters</li>
            </ul>
        </React.Fragment>
    );

    const primaryButtonLabel = useMemo(() => {
        if (authTypeValue === 'phone') {
            if (!otpSent) return 'Send OTP';
            if (!isOtpVerified) return 'Verify OTP';
            return isNewUser ? 'Sign Up' : 'Continue';
        }
        if (!userChecked) return 'Continue';
        return isNewUser ? 'Sign Up' : 'Sign In';
    }, [authTypeValue, otpSent, isOtpVerified, isNewUser, userChecked]);

    const switchAuthType = () => {
        const nextAuthType = authTypeValue === 'phone' ? 'email' : 'phone';
        setAuthTypeValue(nextAuthType);
        setUserChecked(false);
        setIsNewUser(false);
        reset({ email: '', password: '', phone: '', otp: '' });
        resetPhoneFlow();
    };

    return (
        <>
            <div className={containerClassName}>
                <div className="flex flex-column align-items-center justify-content-center gap-5">
                    <img
                        src={`/layout/images/logo-${
                            layoutConfig.colorScheme === 'light' ? 'dark' : 'white'
                        }.png`}
                        alt="Sakai logo"
                        className="mb-5 w-12rem flex-shrink-0"
                    />
                    <div
                        style={{
                            borderRadius: '56px',
                            padding: '0.3rem',
                            background:
                                'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                        }}
                    >
                        <form
                            ref={formRef}
                            className="w-full surface-card py-8 px-5 sm:px-8"
                            style={{ borderRadius: '53px' }}
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div className="text-center mb-5">
                                <div className="text-900 text-3xl font-medium mb-3">
                                    Welcome Guest!
                                </div>
                                <span className="text-600 font-medium">
                                    Continue with your {authTypeValue === 'phone' ? 'phone number' : 'email'}
                                </span>
                            </div>
                            <div className="mb-3">
                                <SelectButton
                                    className="buyer-seller"
                                    value={value}
                                    onChange={(e) => setValue(e.value)}
                                    options={options}
                                />
                            </div>
                            <div>
                                {authTypeValue === 'email' && (
                                    <div className="flex flex-column gap-2 mb-3">
                                        <label
                                            htmlFor="email1"
                                            className="block text-900 text-xl font-medium "
                                        >
                                            Email
                                        </label>
                                        <Controller
                                            name="email"
                                            control={control}
                                            rules={{
                                                required: 'Email is required.',
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: 'Invalid email address. E.g. example@email.com'
                                                }
                                            }}
                                            render={({ field, fieldState }) => (
                                                <InputText
                                                    id={field.name}
                                                    {...field}
                                                    autoFocus
                                                    style={{ padding: '1rem' }}
                                                    className={classNames(
                                                        'w-full md:w-30rem',
                                                        {
                                                            'p-invalid': fieldState.invalid
                                                        }
                                                    )}
                                                    readOnly={userChecked && !isNewUser}
                                                />
                                            )}
                                        />
                                        {errors.email && (
                                            <small className="p-error">
                                                {errors?.email?.message}
                                            </small>
                                        )}
                                    </div>
                                )}
                                {authTypeValue === 'phone' && (
                                    <div className="flex flex-column gap-2 mb-3">
                                        <label
                                            htmlFor="phone"
                                            className="block text-900 text-xl font-medium "
                                        >
                                            Phone
                                        </label>
                                        <Controller
                                            name="phone"
                                            control={control}
                                            rules={{
                                                required: 'Phone is required.'
                                            }}
                                            render={({ field, fieldState }) => (
                                                <PhoneInput
                                                    country={defaultCountry}
                                                    value={field.value || ''}
                                                    onChange={(value) => {
                                                        const normalized = value
                                                            ? value.startsWith('+')
                                                                ? value
                                                                : `+${value}`
                                                            : '';
                                                        field.onChange(normalized);
                                                    }}
                                                    specialLabel=""
                                                    enableSearch
                                                    inputClass={classNames('p-inputtext p-component w-full', {
                                                        'p-invalid': fieldState.invalid || (!!phoneError && otpSent)
                                                    })}
                                                    buttonClass="phone-country-dropdown"
                                                    containerClass="w-full"
                                                    disableCountryCode={false}
                                                    countryCodeEditable={false}
                                                    inputProps={{
                                                        name: field.name,
                                                        required: true,
                                                        autoFocus: true
                                                    }}
                                                    searchPlaceholder="Search country"
                                                />
                                            )}
                                        />
                                        {(errors.phone || (otpSent && phoneError)) && (
                                            <small className="p-error">
                                                {errors?.phone?.message || phoneError}
                                            </small>
                                        )}
                                    </div>
                                )}
                                {otpSent && authTypeValue === 'phone' && !isOtpVerified && (
                                    <div className="flex flex-column gap-2 mb-3">
                                        <label
                                            htmlFor="otp"
                                            className="block text-900 text-xl font-medium "
                                        >
                                            Enter OTP
                                        </label>
                                        <Controller
                                            name="otp"
                                            control={control}
                                            rules={{ required: 'OTP is required.' }}
                                            render={({ field, fieldState }) => (
                                                <InputText
                                                    id={field.name}
                                                    {...field}
                                                    maxLength={6}
                                                    style={{ padding: '1rem' }}
                                                    className={classNames('w-full md:w-30rem', {
                                                        'p-invalid': fieldState.invalid
                                                    })}
                                                />
                                            )}
                                        />
                                        {errors.otp && (
                                            <small className="p-error">{errors?.otp?.message}</small>
                                        )}
                                        <div className="text-600">
                                            We sent an OTP to {formattedPhone}. Please enter it above.
                                        </div>
                                    </div>
                                )}
                                {authTypeValue === 'phone' && isNewUser && isOtpVerified && (
                                    <div className="flex flex-column gap-2 mb-3">
                                        <label
                                            htmlFor="emailAfterOtp"
                                            className="block text-900 text-xl font-medium "
                                        >
                                            Email
                                        </label>
                                        <Controller
                                            name="email"
                                            control={control}
                                            rules={{
                                                required: 'Email is required.',
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: 'Invalid email address. E.g. example@email.com'
                                                }
                                            }}
                                            render={({ field, fieldState }) => (
                                                <InputText
                                                    id={field.name}
                                                    {...field}
                                                    style={{ padding: '1rem' }}
                                                    className={classNames('w-full md:w-30rem', {
                                                        'p-invalid': fieldState.invalid
                                                    })}
                                                />
                                            )}
                                        />
                                        {errors.email && (
                                            <small className="p-error">
                                                {errors?.email?.message}
                                            </small>
                                        )}
                                    </div>
                                )}
                                {authTypeValue === 'email' && userChecked && isNewUser && (
                                    <div className="flex flex-column gap-2 mb-3">
                                        <label
                                            htmlFor="phoneForEmail"
                                            className="block text-900 text-xl font-medium "
                                        >
                                            Phone
                                        </label>
                                        <Controller
                                            name="phone"
                                            control={control}
                                            rules={{
                                                required: 'Phone is required.'
                                            }}
                                            render={({ field, fieldState }) => (
                                                <PhoneInput
                                                    country={defaultCountry}
                                                    value={field.value || ''}
                                                    onChange={(value) => {
                                                        const normalized = value
                                                            ? value.startsWith('+')
                                                                ? value
                                                                : `+${value}`
                                                            : '';
                                                        field.onChange(normalized);
                                                    }}
                                                    specialLabel=""
                                                    enableSearch
                                                    inputClass={classNames('p-inputtext p-component w-full', {
                                                        'p-invalid': fieldState.invalid
                                                    })}
                                                    buttonClass="phone-country-dropdown"
                                                    containerClass="w-full"
                                                    disableCountryCode={false}
                                                    countryCodeEditable={false}
                                                    inputProps={{
                                                        name: field.name,
                                                        required: true
                                                    }}
                                                    searchPlaceholder="Search country"
                                                />
                                            )}
                                        />
                                        {errors.phone && (
                                            <small className="p-error">{errors?.phone?.message}</small>
                                        )}
                                    </div>
                                )}
                                {showPasswordField && (
                                    <div className="flex flex-column gap-2">
                                        <label
                                            htmlFor="password1"
                                            className="block text-900 font-medium text-xl "
                                        >
                                            Password
                                        </label>
                                        <Controller
                                            name="password"
                                            control={control}
                                            rules={{
                                                required:
                                                    isNewUser || authTypeValue === 'email'
                                                        ? 'Password is required.'
                                                        : undefined
                                            }}
                                            render={({ field, fieldState }) => (
                                                <Password
                                                    id={field.name}
                                                    {...field}
                                                    toggleMask
                                                    inputClassName="w-full p-3 md:w-30rem"
                                                    className={classNames('w-full mb-5', {
                                                        'p-invalid': fieldState.invalid
                                                    })}
                                                    header={passwordHeader}
                                                    footer={passwordFooter}
                                                    feedback={isNewUser}
                                                />
                                            )}
                                        />
                                    </div>
                                )}

                                {showRememberMe && (
                                    <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                        <div className="flex align-items-center">
                                            <Checkbox
                                                inputId="rememberme1"
                                                checked={checked}
                                                onChange={(e) => setChecked(e.checked ?? false)}
                                                className="mr-2"
                                            ></Checkbox>
                                            <label htmlFor="rememberme1">Remember me</label>
                                        </div>
                                        <a
                                            onClick={() => setModalVisible(true)}
                                            className="font-medium no-underline ml-2 text-right cursor-pointer"
                                            style={{ color: 'var(--primary-color)' }}
                                        >
                                            Forgot password?
                                        </a>
                                    </div>
                                )}

                                {showTermsAndConditions && (
                                    <div className="mb-4">
                                        By Signing up you agree to our{' '}
                                        <Link href="/policy/seller-terms-and-conditions" target="_blank">
                                            terms and conditions
                                        </Link>
                                    </div>
                                )}

                                <div className="pt-3">
                                    <Button
                                        type="submit"
                                        label={primaryButtonLabel}
                                        loading={isProcessing}
                                        className="w-full p-3 text-xl"
                                        disabled={isProcessing}
                                    ></Button>

                                    <Divider align="center">
                                        <span className="p-tag">OR</span>
                                    </Divider>
                                    <div className="flex justify-content-center w-full">
                                        <GoogleLogin
                                            useOneTap
                                            onSuccess={(credentialResponse) => {
                                                decodeJWT(
                                                    credentialResponse.credential || ''
                                                ).then((data: any) => {
                                                    social.mutate({
                                                        email: data.email,
                                                        name: data.name,
                                                        logo: data.picture,
                                                        socialType: 'google'
                                                    });
                                                });
                                            }}
                                            onError={() => {
                                                toast.error('Login Failed');
                                            }}
                                        />
                                    </div>
                                    <div className="flex justify-content-center w-full mt-3">
                                        <a
                                            onClick={switchAuthType}
                                            className="blue-text cursor-pointer"
                                        >
                                            {authTypeValue === 'phone'
                                                ? 'Login with email instead'
                                                : 'Login with phone instead'}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div style={{ position: 'absolute', bottom: 'auto', width: '100%' }}>
                <AppFooter />
            </div>

            <div id="recaptcha-container" className="hidden" />

            <Dialog
                header="Reset Password Instructions"
                visible={modalVisible}
                style={{ width: '50vw' }}
                onHide={() => {
                    if (!modalVisible) return;
                    setModalVisible(false);
                }}
                footer={forgotPassFooterContent}
            >
                <p className="m-0">
                    We will send a password reset link to your email address shortly.
                    Please check your inbox and follow the instructions in the email to
                    reset your password.
                </p>
                <p className="text-500 mt-2">
                    Note: The reset link will expire in 10 minutes. If you do not receive
                    the email within a few minutes, please check your spam or junk folder.
                </p>
            </Dialog>
        </>
    );
};

export default LoginPage;

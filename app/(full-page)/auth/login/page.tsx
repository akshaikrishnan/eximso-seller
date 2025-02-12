/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useContext, useRef, useState } from 'react';
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { endpoints } from '@/lib/constants/endpoints';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { decodeJWT } from '@/lib/utils/getDataFromToken';
import { Dialog } from 'primereact/dialog';
import Link from 'next/link';
import AppFooter from '@/layout/AppFooter';

type LoginInputs = {
    email: string;
    password?: string;
};

const LoginPage = () => {
    const [checked, setChecked] = useState(false);
    const [isNewUser, setIsNewUser] = useState(true);
    const [userChecked, setUserChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const options = ['Buyer', 'Seller'];
    const [modalVisible, setModalVisible] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const userType = searchParams.get('userType');
    const [value, setValue] = useState(userType || options[0]);
    const formRef = useRef<HTMLFormElement>(null);
    const redirectUser = (token: string) => {
        if (isNewUser) router.push(`/onboarding`);
        else router.push(`/api/auth/login?token=${token}`);
    };
    const buyerDomain = process.env.NEXT_PUBLIC_BUYER_DOMAIN;
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<LoginInputs>();

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
            toast.error(error.response.data.message);
        }
    });

    const mutation = useMutation({
        mutationFn: (data: any) => {
            if (!userChecked) return axios.post(endpoints.checkUser, data);
            if (isNewUser) return axios.post(endpoints.register, { ...data, userType });
            return axios.post(endpoints.login, data);
        },
        onSuccess: (data) => {
            setUserChecked(true);
            toast.success(data.data.message);
            setIsNewUser(data.data.isNewUser);

            if (data.data.token) {
                if (value === 'Buyer') {
                    router.push(
                        `${buyerDomain}api/login?token=${data.data.token}&newUser=${
                            data.data.newUser
                        }&from=${searchParams.get('from') || ''}`
                    );
                    return;
                }
                redirectUser(data.data.token);
            }
        },
        onError: (error: any) => {
            toast.error(error.response.data.message);
        }
    });

    const onSubmit: SubmitHandler<LoginInputs> = (data: LoginInputs) => {
        mutation.mutate(data);
    };

    // const getFormErrorMessage = (name: string) => {
    //     return errors[name] && <small className="p-error">{errors?.[name]?.message}</small>;
    // };

    const containerClassName = classNames(
        'surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden',
        { 'p-input-filled': layoutConfig.inputStyle === 'filled' }
    );

    const checkUser = () => {
        if (isNewUser) {
            router.push('/auth/register');
        }
    };

    const forgotPass = useMutation({
        mutationFn: (data: any) => {
            return axios.post(endpoints.forgotPassword, data);
        },
        onSuccess: (data) => {
            toast.success(data.data.message);
            setModalVisible(false);
        },
        onError: (error: any) => {
            toast.error(error.response.data.message);
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
                onClick={() => forgotPass.mutate({ email: watch('email') })}
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
                                    Continue with your email
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
                                                message:
                                                    'Invalid email address. E.g. example@email.com'
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
                                                readOnly={userChecked}
                                            />
                                        )}
                                    />
                                    {errors.email && (
                                        <small className="p-error">
                                            {errors?.email?.message}
                                        </small>
                                    )}
                                </div>
                                {/* <InputText id="email1" type="text" placeholder="Email address" style={{ padding: '1rem' }}  className="w-full md:w-30rem mb-5" /> */}
                                {userChecked && (
                                    <>
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
                                                    required: 'Password is required.'
                                                }}
                                                render={({ field, fieldState }) => (
                                                    <Password
                                                        id={field.name}
                                                        {...field}
                                                        toggleMask
                                                        inputClassName="w-full p-3 md:w-30rem"
                                                        className={classNames(
                                                            'w-full mb-5',
                                                            {
                                                                'p-invalid':
                                                                    fieldState.invalid
                                                            }
                                                        )}
                                                        header={passwordHeader}
                                                        footer={passwordFooter}
                                                        feedback={isNewUser}
                                                    />
                                                )}
                                            />
                                            {/* <Password inputId="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"></Password> */}
                                        </div>

                                        <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                            <div className="flex align-items-center">
                                                <Checkbox
                                                    inputId="rememberme1"
                                                    checked={checked}
                                                    onChange={(e) =>
                                                        setChecked(e.checked ?? false)
                                                    }
                                                    className="mr-2"
                                                ></Checkbox>
                                                <label htmlFor="rememberme1">
                                                    Remember me
                                                </label>
                                            </div>
                                            <a
                                                onClick={() => setModalVisible(true)}
                                                className="font-medium no-underline ml-2 text-right cursor-pointer"
                                                style={{ color: 'var(--primary-color)' }}
                                            >
                                                Forgot password?
                                            </a>
                                        </div>
                                        {isNewUser && (
                                            <div>
                                                By Signing up you agree to our{' '}
                                                <Link
                                                    href="/policy/seller-terms-and-conditions"
                                                    target="_blank"
                                                >
                                                    terms and conditions
                                                </Link>
                                            </div>
                                        )}
                                    </>
                                )}

                                <div className="pt-3">
                                    <Button
                                        label={
                                            userChecked
                                                ? isNewUser
                                                    ? 'Sign Up'
                                                    : 'Sign In'
                                                : 'Continue'
                                        }
                                        loading={mutation.isPending}
                                        className="w-full p-3 text-xl"
                                        onClick={() => router.push('/')}
                                    ></Button>
                                    {/* {isNewUser && <Button type="submit" loading={mutation.isPending} label="Continue" className="w-full p-3 text-xl"></Button>} */}

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
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div style={{ position: 'absolute', bottom: 'auto', width: '100%' }}>
                <AppFooter />
            </div>

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

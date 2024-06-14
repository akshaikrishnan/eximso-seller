'use client';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { passwordReset } from '../lib/actions/password';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface IResetPass {
    password: string;
    confirmPassword: string;
}

export default function ResetPassword() {
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

    const {
        data: profile,
        isLoading,
        isError
    } = useQuery({
        queryKey: ['profile'],

        queryFn: async () => {
            return axios.get('/api/user').then((res) => res.data);
        }
    });

    const router = useRouter();

    const {
        control,
        formState: { errors },
        watch,
        handleSubmit
    } = useForm<IResetPass>({
        defaultValues: {
            password: '',
            confirmPassword: ''
        },
        mode: 'onBlur'
    });

    const mutation = useMutation({
        mutationFn: passwordReset,
        onSuccess: (data) => {
            console.log(data);
            router.push('/');
            toast.success('Password reset successfully');
        },
        onError: (error) => {
            console.log(error);
            toast.error(error?.message || 'Something went wrong');
        }
    });

    const OnSubmit = (data: any) => {
        const formData = new FormData();
        formData.append('password', data.password);
        mutation.mutate(formData);
    };
    return (
        <div className="flex align-items-center justify-content-center">
            <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
                <div className="text-center mb-5">
                    <img src={profile?.logo} alt="hyper" height={50} className="mb-3" />
                    <div className="text-900 text-3xl font-medium mb-3">
                        Reset Password
                    </div>
                </div>

                <form onSubmit={handleSubmit(OnSubmit)}>
                    <div className="field mb-5">
                        <label
                            htmlFor="email"
                            className="block text-900 font-medium mb-2"
                        >
                            New Password
                        </label>
                        <Controller
                            name="password"
                            control={control}
                            rules={{
                                required: 'Password is required.',
                                minLength: {
                                    value: 8,
                                    message: 'Password must have at least 8 characters.'
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                                    message:
                                        'Password must contain at least one lowercase letter, one uppercase letter, and one numeric digit.'
                                }
                            }}
                            render={({ field, fieldState }) => (
                                <Password
                                    id={field.name}
                                    {...field}
                                    toggleMask
                                    inputClassName="w-full p-3"
                                    className={classNames('w-full ', {
                                        'p-invalid': fieldState.invalid
                                    })}
                                    header={passwordHeader}
                                    footer={passwordFooter}
                                    feedback
                                />
                            )}
                        />
                        {errors?.password && (
                            <small className="p-error">{errors?.password?.message}</small>
                        )}
                    </div>

                    <div className="field mb-5">
                        <label
                            htmlFor="password"
                            className="block text-900 font-medium mb-2"
                        >
                            Confirm Password
                        </label>
                        <Controller
                            name="confirmPassword"
                            control={control}
                            rules={{
                                required: 'Password is required.',
                                validate: (value) =>
                                    value === watch('password') ||
                                    'Passwords do not match'
                            }}
                            render={({ field, fieldState }) => (
                                <Password
                                    id={field.name}
                                    {...field}
                                    toggleMask
                                    inputClassName="w-full p-3"
                                    className={classNames('w-full', {
                                        'p-invalid': fieldState.invalid
                                    })}
                                    header={passwordHeader}
                                    footer={passwordFooter}
                                    feedback={false}
                                />
                            )}
                        />
                        {errors?.confirmPassword && (
                            <small className="p-error">
                                {errors?.confirmPassword?.message}
                            </small>
                        )}
                    </div>

                    <Button
                        loading={mutation.isPending}
                        type="submit"
                        label="Reset Password"
                        icon="pi pi-lock"
                        className="w-full"
                    />
                </form>
            </div>
        </div>
    );
}

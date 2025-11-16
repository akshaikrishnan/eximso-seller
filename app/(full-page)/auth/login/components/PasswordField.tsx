'use client';

import { Control, Controller, FieldErrors } from 'react-hook-form';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import { ReactNode } from 'react';
import { LoginInputs } from '../types';

interface PasswordFieldProps {
    control: Control<LoginInputs>;
    errors: FieldErrors<LoginInputs>;
    passwordHeader: ReactNode;
    passwordFooter: ReactNode;
    requirePassword: boolean;
}

const PasswordField = ({
    control,
    errors,
    passwordHeader,
    passwordFooter,
    requirePassword
}: PasswordFieldProps) => {
    return (
        <div className="flex flex-column gap-2">
            <label htmlFor="password" className="block text-900 font-medium text-xl ">
                Password
            </label>
            <Controller
                name="password"
                control={control}
                rules={{
                    required: requirePassword ? 'Password is required.' : undefined
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
                        feedback={requirePassword}
                    />
                )}
            />
            {errors.password && <small className="p-error">{errors?.password?.message}</small>}
        </div>
    );
};

export default PasswordField;

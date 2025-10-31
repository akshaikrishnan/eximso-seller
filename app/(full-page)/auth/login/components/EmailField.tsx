'use client';

import { Controller, Control, FieldErrors } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { LoginInputs } from '../types';

interface EmailFieldProps {
    control: Control<LoginInputs>;
    errors: FieldErrors<LoginInputs>;
    label?: string;
    name?: 'email';
    autoFocus?: boolean;
    readOnly?: boolean;
    id?: string;
}

const EmailField = ({
    control,
    errors,
    label = 'Email',
    name = 'email',
    autoFocus,
    readOnly,
    id
}: EmailFieldProps) => {
    return (
        <div className="flex flex-column gap-2 mb-3">
            <label htmlFor={id ?? name} className="block text-900 text-xl font-medium ">
                {label}
            </label>
            <Controller
                name={name}
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
                        id={id ?? field.name}
                        {...field}
                        autoFocus={autoFocus}
                        readOnly={readOnly}
                        style={{ padding: '1rem' }}
                        className={classNames('w-full md:w-30rem', {
                            'p-invalid': fieldState.invalid
                        })}
                    />
                )}
            />
            {errors[name] && (
                <small className="p-error">{errors?.[name]?.message as string}</small>
            )}
        </div>
    );
};

export default EmailField;

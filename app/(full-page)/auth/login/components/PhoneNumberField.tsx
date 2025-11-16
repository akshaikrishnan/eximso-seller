'use client';

import { Controller, Control, FieldErrors } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import PhoneInput from 'react-phone-input-2';
import { LoginInputs } from '../types';

interface PhoneNumberFieldProps {
    control: Control<LoginInputs>;
    errors: FieldErrors<LoginInputs>;
    defaultCountry: string;
    errorMessage?: string;
    autoFocus?: boolean;
    disabled?: boolean;
    name?: 'phone';
}

const PhoneNumberField = ({
    control,
    errors,
    defaultCountry,
    errorMessage,
    autoFocus,
    disabled,
    name = 'phone'
}: PhoneNumberFieldProps) => {
    const hasError = Boolean(errors[name] || errorMessage);
    return (
        <div className="flex flex-column gap-2 mb-3">
            <label htmlFor={name} className="block text-900 text-xl font-medium ">
                Phone
            </label>
            <Controller
                name={name}
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
                        inputClass={classNames('p-inputtext p-component w-full md:w-30rem phone-input-field', {
                            'p-invalid': fieldState.invalid || hasError
                        })}
                        buttonClass={classNames('phone-country-dropdown', {
                            'p-invalid': fieldState.invalid || hasError
                        })}
                        containerClass="w-full phone-input-container"
                        disableCountryCode={false}
                        countryCodeEditable={false}
                        inputProps={{
                            name: field.name,
                            required: true,
                            autoFocus,
                            disabled,
                            autoComplete: 'tel'
                        }}
                        searchPlaceholder="Search country"
                        disabled={disabled}
                    />
                )}
            />
            {hasError && <small className="p-error">{errors?.[name]?.message || errorMessage}</small>}
        </div>
    );
};

export default PhoneNumberField;

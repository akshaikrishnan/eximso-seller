'use client';

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import { LoginInputs } from '../types';

interface OtpFieldProps {
    control: Control<LoginInputs>;
    errors: FieldErrors<LoginInputs>;
    formattedPhone: string;
    resendSeconds: number;
    onResend: () => void;
    isResendDisabled: boolean;
    isProcessing: boolean;
}

const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
        .toString()
        .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
};

const OtpField = ({
    control,
    errors,
    formattedPhone,
    resendSeconds,
    onResend,
    isResendDisabled,
    isProcessing
}: OtpFieldProps) => {
    return (
        <div className="flex flex-column gap-2 mb-3">
            <label htmlFor="otp" className="block text-900 text-xl font-medium ">
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
                        autoComplete="one-time-code"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        style={{ padding: '1rem' }}
                        className={classNames('w-full md:w-30rem', {
                            'p-invalid': fieldState.invalid
                        })}
                    />
                )}
            />
            {errors.otp && <small className="p-error">{errors?.otp?.message}</small>}
            <div className="flex align-items-center justify-content-between text-600">
                <span>We sent an OTP to {formattedPhone}. Please enter it above.</span>
                <Button
                    type="button"
                    link
                    label={isResendDisabled ? `Resend in ${formatCountdown(resendSeconds)}` : 'Resend OTP'}
                    onClick={onResend}
                    disabled={isResendDisabled || isProcessing}
                    className="p-0"
                />
            </div>
            <div className="text-600 text-sm">
                Didn&apos;t receive the code? Try resending after the countdown ends.
            </div>
        </div>
    );
};

export default OtpField;

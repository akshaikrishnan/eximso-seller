import ResetPassword from '@/components/reset-password';
import React from 'react';

export default function Reset() {
    return (
        <main className="surface-ground min-h-screen min-w-screen overflow-hidden">
            {/* Logo Section */}
            <div className="flex justify-content-center pt-6">
                <img
                    src="/layout/images/logo-dark.png"
                    alt="Logo"
                    height={100}
                    className="mb-4"
                />
            </div>

            {/* Reset Password Section */}
            <div className="flex align-items-center justify-content-center">
                <ResetPassword shouldLogout={true} />
            </div>
        </main>
    );
}

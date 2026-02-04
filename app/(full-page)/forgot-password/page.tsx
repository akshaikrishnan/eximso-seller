import ResetPassword from '@/components/reset-password';
import React from 'react';

export default function Reset() {
    return (
        <main className="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
            {/* add logo and back arrow */}
            <ResetPassword shouldLogout={true} />
        </main>
    );
}

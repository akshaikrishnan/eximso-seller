import { Metadata } from 'next';
import AppConfig from '../../layout/AppConfig';
import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

interface SimpleLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'Eximso | Seller Panel',
    description: 'Seller dashboard of Eximso b2b ecommerce'
};

export default function SimpleLayout({ children }: SimpleLayoutProps) {
    return (
        <React.Fragment>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
                {children}
                <AppConfig simple />
            </GoogleOAuthProvider>
        </React.Fragment>
    );
}

'use client';
import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import RootProvider from '@/providers/providers';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link id="theme-css" href={`/themes/lara-light-purple/theme.css`} rel="stylesheet"></link>
            </head>
            <body>
                <RootProvider>
                    {children}
                    <ReactQueryDevtools initialIsOpen={false} />
                </RootProvider>
            </body>
        </html>
    );
}

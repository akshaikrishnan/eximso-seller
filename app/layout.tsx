'use client';
import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
// import 'primereact/resources/primereact.css';
// import 'primeflex/primeflex.css';
// import 'primeicons/primeicons.css';
// import '../styles/layout/layout.scss';
// import '../styles/demo/Demos.scss';
import RootProvider from '@/providers/providers';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import HelpFloat from '@/demo/components/helpFloat';
import { Analytics } from '@vercel/analytics/react';
interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link
                    id="theme-css"
                    href={`/themes/lara-light-purple/theme.css`}
                    rel="stylesheet"
                ></link>
            </head>
            <body
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    backgroundColor: '#285A48',
                    color: '#B0E4CC',
                    fontSize: '120px',
                    fontWeight: '700',
                    flexDirection: 'column',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
                }}
            >
                NOT FOUND
                <span
                    style={{
                        display: 'block',
                        fontSize: '24px',
                        fontWeight: '400',
                        marginTop: '20px',
                        color: '#B0E4CC'
                    }}
                >
                    This repository is moved to another organization. Please update your
                    remote URL.
                </span>
                {/* <RootProvider>
                    {children}
                    <HelpFloat />
                    <Analytics />
                    <ReactQueryDevtools initialIsOpen={false} />
                </RootProvider> */}
            </body>
        </html>
    );
}

'use client';
import { LayoutProvider } from '@/layout/context/layoutcontext';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { PrimeReactProvider } from 'primereact/api';
import React, { useState } from 'react';
import { Toaster } from 'sonner';

function RootProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = React.useState(
        new QueryClient({
            defaultOptions: { queries: { staleTime: 60 * 1000, refetchOnWindowFocus: true } }
        })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {' '}
            <PrimeReactProvider>
                <LayoutProvider>
                    <Toaster />
                    {children}
                </LayoutProvider>
            </PrimeReactProvider>
        </QueryClientProvider>
    );
}

export default RootProvider;

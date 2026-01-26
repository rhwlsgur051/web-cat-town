'use client';

import { Header } from '@/components/molecules/header';
import { ReduxProvider } from '@/providers/redux-provider';
import { HeroUIProvider } from '@heroui/react';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ReduxProvider>
            <HeroUIProvider>
                <Header />
                <div id="body-container">
                    {children}
                </div>
            </HeroUIProvider>
        </ReduxProvider>
    );
}

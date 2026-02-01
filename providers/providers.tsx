'use client';

import { Header } from '@/components/molecules/header';
import { ReduxProvider } from '@/providers/redux-provider';
import { HeroUIProvider } from '@heroui/react';
import { usePathname } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Footer } from '@/components/molecules/footer';

export function Providers({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const hideHeader = pathname === '/login' || pathname === '/join';
    const queryClient = new QueryClient(); // QueryClient 인스턴스 생성  (캐시 관리 객체)
    return (
        <QueryClientProvider client={queryClient}>
            <ReduxProvider>
                <HeroUIProvider>
                    {!hideHeader && <Header />}
                    <div id="body-container">
                        {children}
                    </div>
                    {!hideHeader && <Footer />}
                </HeroUIProvider>
            </ReduxProvider>
        </QueryClientProvider>
    );
}

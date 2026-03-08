'use client';

import { Header } from '@/components/atomic/molecules/header';
import { ReduxProvider } from '@/providers/redux-provider';
import { HeroUIProvider } from '@heroui/react';
import { usePathname } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Footer } from '@/components/atomic/molecules/footer';
import { useState, memo } from 'react';

// Header/Footer 로직을 별도 컴포넌트로 분리하여 Provider 리렌더링 방지
const ConditionalLayout = memo(({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const hideHeader = pathname === '/login' || pathname === '/join';

    return (
        <div>
            <div className="mx-auto">
                {!hideHeader && <Header />}
                <div>
                    {children}
                </div>
            </div>
            <div id="modal-root" />
            {!hideHeader && <Footer />}
        </div>
    );
});

ConditionalLayout.displayName = 'ConditionalLayout';

export function Providers({ children }: { children: React.ReactNode }) {
    // QueryClient를 useState로 한 번만 생성 (성능 최적화)
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000, // 1분간 데이터를 fresh로 간주
                gcTime: 5 * 60 * 1000, // 5분간 캐시 유지
                refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 refetch 비활성화
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            <ReduxProvider>
                <HeroUIProvider>
                    <ConditionalLayout>
                        {children}
                    </ConditionalLayout>
                </HeroUIProvider>
            </ReduxProvider>
        </QueryClientProvider>
    );
}

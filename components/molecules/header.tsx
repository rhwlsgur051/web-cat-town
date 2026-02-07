'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogoBoxHorizontal } from "./logo-box-horizontal"
import { UserAvatar } from "../client-components/atoms/user-avatar"
import { useAppSelector } from "@/stores/hooks"
import { useRouter } from "next/navigation"
import { Button } from "@heroui/react"
import { memo } from "react"

// 네비게이션 링크를 별도 컴포넌트로 분리 (pathname 변경 시 이 부분만 리렌더링)
const Navigation = memo(() => {
    const pathname = usePathname();
    
    return (
        <nav className="flex items-center gap-8">
            <Link 
                href="/" 
                className={`text-base font-semibold transition-colors ${
                    pathname === '/' 
                        ? 'text-amber-900 border-b-2 border-amber-900' 
                        : 'text-amber-700 hover:text-amber-900'
                }`}
            >
                피드
            </Link>
            <Link 
                href="/shopping" 
                className={`text-base font-semibold transition-colors ${
                    pathname === '/shopping' 
                        ? 'text-amber-900 border-b-2 border-amber-900' 
                        : 'text-amber-700 hover:text-amber-900'
                }`}
            >
                쇼핑
            </Link>
        </nav>
    );
});

Navigation.displayName = 'Navigation';

// 사용자 정보 영역을 별도 컴포넌트로 분리 (user 상태 변경 시에만 리렌더링)
const UserSection = memo(() => {
    const router = useRouter();
    // 필요한 필드만 선택해서 가져오기 (불필요한 리렌더링 방지)
    const { userId, userName, userAvatarUrl } = useAppSelector((state) => ({
        userId: state.user.userId,
        userName: state.user.userName,
        userAvatarUrl: state.user.userAvatarUrl
    }));
    const isLoggedIn = !!userId;

    return (
        <div className="flex items-center gap-4">
            {isLoggedIn ? (
                // 로그인 상태
                <>
                    <div className="flex items-center gap-2">
                        <UserAvatar
                            src={userAvatarUrl || '/user.png'}
                            name={userName || ''}
                            size="sm"
                        />
                        <span className="text-sm font-semibold">{userName}님</span>
                    </div>
                    <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        onClick={() => router.push('/my-page')}
                    >
                        마이페이지
                    </Button>
                </>
            ) : (
                // 비로그인 상태
                <>
                    <Link href="/login">로그인</Link>
                    <Link href="/join">회원가입</Link>
                </>
            )}
        </div>
    );
});

UserSection.displayName = 'UserSection';

export const Header = () => {
    return (
        <header className="sticky top-0 h-[80px] bg-amber-200 flex items-center justify-center px-4 z-50 border-b-1 border-b-amber-300">
            <div className="w-full max-w-[1200px] flex items-center justify-between">
                {/* 로고 */}
                <div>
                    <Link href="/">
                        <LogoBoxHorizontal />
                    </Link>
                </div>

                {/* 중앙 메뉴 */}
                <Navigation />

                {/* 우측 사용자 영역 */}
                <UserSection />
            </div>
        </header>
    );
}
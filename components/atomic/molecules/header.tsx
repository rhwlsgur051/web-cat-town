'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogoBoxHorizontal } from "./logo-box-horizontal"
import { UserAvatar } from "../atoms/user-avatar"
import { useAppSelector } from "@/stores/hooks"
import { useRouter } from "next/navigation"
import { memo } from "react"

// 네비게이션 링크를 별도 컴포넌트로 분리 (pathname 변경 시 이 부분만 리렌더링)
const Navigation = memo(() => {
    const pathname = usePathname();

    return (
        <nav className="flex items-center gap-8">
            <Link
                href="/"
                className={`text-base font-semibold transition-colors ${pathname === '/'
                    ? 'text-amber-900 border-b-2 border-amber-900'
                    : 'text-amber-700 hover:text-amber-900'
                    }`}
            >
                일상
            </Link>
            <Link
                href="/health"
                className={`text-base font-semibold transition-colors ${pathname === '/health'
                    ? 'text-amber-900 border-b-2 border-amber-900'
                    : 'text-amber-700 hover:text-amber-900'
                    }`}
            >
                건강
            </Link>
            <Link
                href="/shopping"
                className={`text-base font-semibold transition-colors ${pathname === '/shopping'
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
                    <button
                        className="cursor-pointer"
                        onClick={() => router.push('/my-page')}
                    >
                        <div className="flex items-center gap-2">
                            <UserAvatar
                                src={userAvatarUrl || '/user.png'}
                                name={userName || ''}
                                size="sm"
                            />
                        </div>
                    </button>
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
        <header className="sticky top-0 h-[80px] w-full rounded-t-2xl bg-white flex items-center justify-center px-4 z-50 border-b-1 border-b-slate-100">
            <div className="w-full max-w-[1200px] flex items-center justify-between">
                <div className="flex items-center gap-20">
                    {/* 로고 */}
                    <LogoBoxHorizontal />

                    {/* 중앙 메뉴 */}
                    <Navigation />

                </div>
                {/* 우측 사용자 영역 */}
                <UserSection />
            </div>
        </header>
    );
}
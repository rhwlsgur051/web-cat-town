'use client'
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogoBoxHorizontal } from "./logo-box-horizontal"
import { UserAvatar } from "../client-components/atoms/user-avatar"
import { useAppSelector, useAppDispatch } from "@/stores/hooks"
import { useRouter } from "next/navigation"
import { Button } from "@heroui/react"

export const Header = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathname = usePathname();

    // Redux에서 user 상태 가져오기
    const user = useAppSelector((state) => state.user);
    const isLoggedIn = !!user.userId;

    return <header className="sticky top-0 h-[80px] bg-amber-200 flex items-center justify-center px-4 z-50 border-b-1 border-b-amber-300">
        <div className="w-full max-w-[1200px] flex items-center justify-between">
            {/* 로고 */}
            <div>
                <Link href="/">
                    <LogoBoxHorizontal />
                </Link>
            </div>

            {/* 중앙 메뉴 */}
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

            {/* 우측 사용자 영역 */}
            <div className="flex items-center gap-4">
                {isLoggedIn ? (
                    // 로그인 상태
                    <>
                        <div className="flex items-center gap-2">
                            <UserAvatar
                                src={user.userAvatarUrl || '/user.png'}
                                name={user.userName || ''}
                                size="sm"
                            />
                            <span className="text-sm font-semibold">{user.userName}님</span>
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
        </div>
    </header>
}
'use client'
import Link from "next/link"
import { LogoBoxHorizontal } from "./logo-box-horizontal"
import { useAppSelector, useAppDispatch } from "@/stores/hooks"
import { clearUser } from "@/stores/user-slice"
import { clearTokens } from "@/lib/utils/token"
import { useRouter } from "next/navigation"
import { Button } from "@heroui/react"

export const Header = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    
    // Redux에서 user 상태 가져오기
    const user = useAppSelector((state) => state.user);
    const isLoggedIn = !!user.userId;

    // 로그아웃 처리
    const handleLogout = () => {
        clearTokens(); // 토큰 삭제
        dispatch(clearUser()); // Redux 상태 초기화
        router.push('/login');
    };

    return <header className="sticky top-0 h-[80px] bg-amber-200 flex items-center justify-center px-4 z-50 border-b-1 border-b-amber-300">
        <div className="w-full max-w-[760px] flex items-center justify-between">
            <div>
                <Link href="/">
                    <LogoBoxHorizontal />
                </Link>
            </div>
            <div className="flex items-center gap-4">
                {isLoggedIn ? (
                    // 로그인 상태
                    <>
                        <span className="text-sm font-semibold">{user.userName}님</span>
                        <Button 
                            size="sm" 
                            variant="flat" 
                            color="default"
                            onClick={handleLogout}
                        >
                            로그아웃
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
import Link from "next/link"

export const Header = () => {
    return <header className="sticky top-0 h-[80px] bg-amber-200 flex items-center justify-center px-4">
        <div className="w-full max-w-[760px] flex items-center justify-between">
            <div>
                <Link href="/">홈</Link>
            </div>
            <div className="flex items-center gap-4">
                <Link href="/login">로그인</Link>
                <Link href="/join">회원가입</Link>
            </div>
        </div>
    </header>
}
'use client'

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-amber-100 border-t-1 border-t-amber-300 py-8 mt-auto">
            <div className="max-w-[760px] mx-auto px-4">
                <div className="flex flex-col items-center gap-4">
                    {/* 로고/제목 */}
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-amber-800">캣타운</h3>
                        <p className="text-sm text-gray-600 mt-1">집사들의 커뮤니티</p>
                    </div>

                    {/* 이메일 */}
                    <div className="flex gap-6 text-sm text-gray-700">
                        rhwlsgur051@gmail.com
                    </div>

                    {/* 구분선 */}
                    <div className="w-full border-t border-amber-300"></div>

                    {/* 저작권 */}
                    <div className="text-xs text-gray-500 text-center">
                        <p>© {currentYear} 캣타운. All rights reserved.</p>
                        <p className="mt-1">Made with 🐱 by Cat Lovers</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

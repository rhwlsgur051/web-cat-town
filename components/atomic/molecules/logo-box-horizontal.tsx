'use client'
import Image from "next/image";
import Logo from '@/public/logo.png'
import Link from "next/link";
import localFont from "next/font/local"

const luckiestGuy = localFont({
    src: '../../../public/fonts/LuckiestGuy-Regular.ttf',
    weight: "45 920",
    style: 'normal',
    display: 'swap',
});

export const LogoBoxHorizontal = () => {
    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return <Link className="flex items-center" href="/" onClick={handleClick}>
        {/* Logo Image */}
        <Image src={Logo} className="m-1 " alt="logo" width={50} />
        {/* Logo Text */}
        <h1 className={`font-luckiest text-4xl font-bold ${luckiestGuy.className}`}>CAT TOWN</h1>
    </Link>
}
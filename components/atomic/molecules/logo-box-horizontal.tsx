'use client'
import Image from "next/image";
import Logo from '@/public/logo.png'
import Link from "next/link";

export const LogoBoxHorizontal = () => {
    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return <Link className="flex items-center" href="/" onClick={handleClick}>
        {/* Logo Image */}
        <Image src={Logo} className="m-1 " alt="logo" width={50} />
        {/* Logo Text */}
        <h1 className="font-luckiest text-4xl font-bold">CAT TOWN</h1>
    </Link>
}
import Image from "next/image";
import Logo from '@/public/logo.png'
import Link from "next/link";

export const LogoBoxVertical = () => {
    return <Link className="flex flex-col items-center gap-2 hover:bg-gray-100 transition-all duration-300 p-4 rounded-4xl" href="/">
        {/* Logo Image */}
        <Image src={Logo} className="m-1 " alt="logo" width={120} />
        {/* Logo Text */}
        <h1 className="font-luckiest text-4xl font-bold">CAT TOWN</h1>
    </Link>
}
'use client'
import { useEffect, useState } from "react";
import { Button, Image, Input } from "@heroui/react";
import Logo from '@/public/logo.png'
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/stores/hooks";
import Link from "next/link";
import { ErrorEnum } from "@/static/error-enum";

export const LoginPage = () => {
    const dispatch = useAppDispatch();
    const [errMsg, setErrMsg] = useState(''); // 로그인 에러 메시지

    const { register, handleSubmit, formState: { errors, isValid } } = useForm({
        defaultValues: {
            id: '', password: ''
        }
    })

    const onSubmit = (data: any) => {
        console.log(data);
        setErrMsg(ErrorEnum.USER001)
    }

    useEffect(() => {
        console.log(isValid);
    }, [isValid]);

    return <form className='max-w-[500px] flex flex-col gap-4 items-center mt-12' onSubmit={handleSubmit(onSubmit)}>
        {/* Logo Image */}
        <Image src={Logo.src} className="m-1 " alt="logo" width={120} />
        {/* Logo Text */}
        <h1 className="font-luckiest text-4xl font-bold">CAT TOWN</h1>
        <div className="flex flex-col gap-4">
            <Input {...register('id', { required: true })} className="w-full max-w-[300px]" label="아이디" placeholder="아이디를 입력하세요." type="id" maxLength={30} />
            <Input {...register('password', { required: true })} className="w-full max-w-[300px]" label="비밀번호" placeholder="비밀번호를 입력하세요." type="password" maxLength={20} />
        </div>
        <Button type="submit" color="primary" className="w-full max-w-[300px]" isDisabled={!isValid}>로그인</Button>
        {/* Error Message Box */}
        <div className="text-red-500">
            {errMsg}
        </div>
        <hr className="border-0 h-[1px] w-full bg-[#ccc]" />
        <Link className="text-[#555]" href="/join">회원가입</Link>
    </form>
}

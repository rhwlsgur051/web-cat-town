'use client'
import { useEffect, useState } from "react";
import { Button, Image, Input } from "@heroui/react";
import Logo from '@/public/logo.png'
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/stores/hooks";
import Link from "next/link";
import { ErrorEnum } from "@/static/error-enum";

interface JoinFormData {
    id: string;
    email: string;
    password: string;
    passwordConfirm: string;
    name: string;
}

export const JoinPage = () => {
    const dispatch = useAppDispatch();
    const [errMsg, setErrMsg] = useState(''); // 회원가입 에러 메시지
    const [successMsg, setSuccessMsg] = useState(''); // 성공 메시지

    const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm<JoinFormData>({
        mode: 'onChange',
        defaultValues: {
            id: '',
            email: '',
            password: '',
            passwordConfirm: '',
            name: ''
        }
    })

    const password = watch('password');

    const onSubmit = (data: JoinFormData) => {
        console.log('회원가입 데이터:', data);
        
        // 비밀번호 확인 검증
        if (data.password !== data.passwordConfirm) {
            setErrMsg('비밀번호가 일치하지 않습니다.');
            setSuccessMsg('');
            return;
        }

        // 여기에 실제 회원가입 API 호출 로직 추가
        setSuccessMsg('회원가입이 완료되었습니다!');
        setErrMsg('');
        
        // 성공 후 로그인 페이지로 이동 (예시)
        // router.push('/login');
    }

    useEffect(() => {
        console.log('폼 유효성:', isValid);
        console.log('에러:', errors);
    }, [isValid, errors]);

    return <form className='max-w-[500px] w-full flex flex-col gap-4 items-center mt-12 px-4' onSubmit={handleSubmit(onSubmit)}>
        {/* Logo Image */}
        <Image src={Logo.src} className="m-1" alt="logo" width={100} />
        
        {/* Logo Text */}
        <h1 className="font-luckiest text-3xl font-bold">회원가입</h1>
        
        <div className="flex flex-col gap-4 w-full">
            {/* 아이디 */}
            <Input 
                {...register('id', { 
                    required: '아이디를 입력해주세요.',
                    minLength: { value: 4, message: '아이디는 4자 이상이어야 합니다.' },
                    pattern: { value: /^[a-zA-Z0-9]+$/, message: '영문자와 숫자만 사용 가능합니다.' }
                })} 
                className="w-full max-w-[350px]" 
                label="아이디" 
                placeholder="영문자와 숫자 4자 이상" 
                type="text" 
                maxLength={20}
                isInvalid={!!errors.id}
                errorMessage={errors.id?.message}
            />

            {/* 이메일 */}
            <Input 
                {...register('email', { 
                    required: '이메일을 입력해주세요.',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '올바른 이메일 형식이 아닙니다.' }
                })} 
                className="w-full max-w-[350px]" 
                label="이메일" 
                placeholder="example@email.com" 
                type="email" 
                maxLength={50}
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
            />

            {/* 이름 */}
            <Input 
                {...register('name', { 
                    required: '이름을 입력해주세요.',
                    minLength: { value: 2, message: '이름은 2자 이상이어야 합니다.' }
                })} 
                className="w-full max-w-[350px]" 
                label="이름" 
                placeholder="이름을 입력하세요" 
                type="text" 
                maxLength={20}
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
            />

            {/* 비밀번호 */}
            <Input 
                {...register('password', { 
                    required: '비밀번호를 입력해주세요.',
                    minLength: { value: 8, message: '비밀번호는 8자 이상이어야 합니다.' },
                    pattern: { 
                        value: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                        message: '영문, 숫자, 특수문자를 포함해야 합니다.'
                    }
                })} 
                className="w-full max-w-[350px]" 
                label="비밀번호" 
                placeholder="영문, 숫자, 특수문자 포함 8자 이상" 
                type="password" 
                maxLength={30}
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
            />

            {/* 비밀번호 확인 */}
            <Input 
                {...register('passwordConfirm', { 
                    required: '비밀번호 확인을 입력해주세요.',
                    validate: (value) => value === password || '비밀번호가 일치하지 않습니다.'
                })} 
                className="w-full max-w-[350px]" 
                label="비밀번호 확인" 
                placeholder="비밀번호를 다시 입력하세요" 
                type="password" 
                maxLength={30}
                isInvalid={!!errors.passwordConfirm}
                errorMessage={errors.passwordConfirm?.message}
            />
        </div>

        {/* 회원가입 버튼 */}
        <Button 
            type="submit" 
            color="primary" 
            className="w-full max-w-[350px]" 
            isDisabled={!isValid}
        >
            회원가입
        </Button>

        {/* Error Message Box */}
        {errMsg && (
            <div className="text-red-500 text-sm">
                {errMsg}
            </div>
        )}

        {/* Success Message Box */}
        {successMsg && (
            <div className="text-green-500 text-sm">
                {successMsg}
            </div>
        )}

        <hr className="border-0 h-[1px] w-full max-w-[350px] bg-[#ccc]" />
        
        {/* 로그인 페이지로 이동 */}
        <div className="flex gap-2 text-sm">
            <span className="text-[#777]">이미 계정이 있으신가요?</span>
            <Link className="text-[#555] font-semibold hover:text-primary" href="/login">
                로그인
            </Link>
        </div>
    </form>
}

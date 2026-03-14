'use client'
import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "@/stores/hooks";
import Link from "next/link";
import { LogoBoxVertical } from "../../../atomic/molecules/logo-box-vertical";
import { useMutation } from "@tanstack/react-query";
import { authApi, LoginRequest } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { setTokens } from "@/lib/utils/token";
import { setUser } from "@/stores/user-slice";

export const LoginPage = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [errMsg, setErrMsg] = useState('');

    const { register, handleSubmit, formState: { errors, isValid } } = useForm<LoginRequest>({
        defaultValues: {
            userId: '',
            userPwd: ''
        }
    });

    // Login Mutation
    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            // Access Token과 Refresh Token 저장
            if (data.accessToken && data.refreshToken) {
                setTokens(data.accessToken, data.refreshToken);
            }
            
            // Redux에 사용자 정보 저장 (필요시)
            dispatch(setUser(data.user!));
            
            // 메인 페이지로 이동
            router.push('/');
        },
        onError: (error: Error) => {
            console.error('로그인 실패:', error);
            setErrMsg(error.message);
        },
    });

    const onSubmit = (data: LoginRequest) => {
        setErrMsg(''); // 기존 에러 메시지 초기화
        
        // Mutation 실행
        loginMutation.mutate(data);
    };

    return (
        <form className='max-w-[500px] flex flex-col gap-4 items-center mt-12 mx-auto' onSubmit={handleSubmit(onSubmit)}>
            {/* Logo Box */}
            <LogoBoxVertical />
            
            <div className="flex flex-col gap-4">
                <Input 
                    {...register('userId', { required: '아이디를 입력해주세요.' })} 
                    className="w-[200px]" 
                    label="아이디" 
                    placeholder="아이디를 입력하세요." 
                    type="text" 
                    maxLength={30}
                    isInvalid={!!errors.userId}
                    errorMessage={errors.userId?.message}
                />
                <Input 
                    {...register('userPwd', { required: '비밀번호를 입력해주세요.' })} 
                    className="w-[200px]" 
                    label="비밀번호" 
                    placeholder="비밀번호를 입력하세요." 
                    type="password" 
                    maxLength={20}
                    isInvalid={!!errors.userPwd}
                    errorMessage={errors.userPwd?.message}
                />
            </div>
            
            <Button 
                type="submit" 
                color="primary" 
                className="w-[200px]" 
                isDisabled={!isValid || loginMutation.isPending}
                isLoading={loginMutation.isPending}
            >
                {loginMutation.isPending ? '로그인 중...' : '로그인'}
            </Button>
            
            {/* Error Message Box */}
            {(errMsg || loginMutation.error) && (
                <div className="text-red-500">
                    {errMsg || loginMutation.error?.message}
                </div>
            )}
            
            <hr className="border-0 h-px w-full bg-[#ccc]" />
            <Link className="text-[#555]" href="/join">회원가입</Link>
        </form>
    );
}

'use client'
import { useState } from "react";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { LogoBoxVertical } from "@/components/molecules/logo-box-vertical";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { useRouter } from "next/navigation";

interface Cat {
    catName: string;
    catBirth: string;
    catGender: 'male' | 'female' | '';
    catBreed: string;
}

interface JoinFormData {
    userId: string;
    userEmail: string;
    userPwd: string;
    userPwdConfirm: string;
    userName: string;
}

export const JoinPage = () => {
    const router = useRouter();
    const [errMsg, setErrMsg] = useState(''); // 회원가입 에러 메시지
    const [cats, setCats] = useState<Cat[]>([]); // 고양이 목록

    const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm<JoinFormData>({
        mode: 'onChange',
        defaultValues: {
            userId: '',
            userEmail: '',
            userPwd: '',
            userPwdConfirm: '',
            userName: ''
        }
    })

    const password = watch('userPwd');

    // 고양이 추가
    const addCat = () => {
        setCats([...cats, { catName: '', catBirth: '', catGender: '', catBreed: '' }]);
    };

    // 고양이 삭제
    const removeCat = (index: number) => {
        setCats(cats.filter((_, i) => i !== index));
    };

    // 고양이 정보 수정
    const updateCat = (index: number, field: keyof Cat, value: string) => {
        const newCats = [...cats];
        newCats[index] = { ...newCats[index], [field]: value };
        setCats(newCats);
    };

    const onSubmit = (data: JoinFormData) => {
        // 비밀번호 확인 검증
        if (data.userPwd !== data.userPwdConfirm) {
            setErrMsg('비밀번호가 일치하지 않습니다.');
            return;
        }

        if (cats.length > 0) {
            const hasEmptyName = cats.some(cat => !cat.catName.trim());
            if (hasEmptyName) {
                setErrMsg('고양이 이름을 입력해주세요.');
                return;
            }
        }

        // API 호출
        joinMutation.mutate({
            userId: data.userId,
            userEmail: data.userEmail,
            userPwd: data.userPwd,
            userName: data.userName,
            cats: cats.length > 0
                ? cats.map(({ catName, catBirth, catGender, catBreed }) => ({
                    catName,
                    catBirth,
                    catGender: catGender === 'male' || catGender === 'female' ? catGender : 'male', // 기본값 보정
                    catBreed
                }))
                : [],
        });

    }

    // Mutation 정의
    const joinMutation = useMutation({
        mutationFn: authApi.join,
        onSuccess: (data) => {
            // 여기에 실제 회원가입 API 호출 로직 추가
            setErrMsg('');
            alert('회원가입이 완료되었습니다!');
            // 성공 시 로그인 페이지로 이동
            router.push('/login');
        },
        onError: (error: Error) => {
            console.error('회원가입 실패:', error);
            setErrMsg(error.message);
        },
    });

    return <form className='max-w-[500px] w-full flex flex-col gap-4 items-center mt-12 px-4' onSubmit={handleSubmit(onSubmit)}>
        {/* Logo Box */}
        <LogoBoxVertical />

        <div className="flex flex-col gap-4 w-full items-center">
            {/* 아이디 */}
            <Input
                {...register('userId', {
                    required: '아이디를 입력해주세요.',
                    minLength: { value: 4, message: '아이디는 4자 이상이어야 합니다.' },
                    pattern: { value: /^[a-zA-Z0-9]+$/, message: '영문자와 숫자만 사용 가능합니다.' }
                })}
                className="w-full max-w-[350px]"
                label="아이디"
                placeholder="영문자와 숫자 4자 이상"
                type="text"
                maxLength={20}
                isInvalid={!!errors.userId}
                errorMessage={errors.userId?.message}
            />

            {/* 이메일 */}
            <Input
                {...register('userEmail', {
                    required: '이메일을 입력해주세요.',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '올바른 이메일 형식이 아닙니다.' }
                })}
                className="w-full max-w-[350px]"
                label="이메일"
                placeholder="example@email.com"
                type="email"
                maxLength={50}
                isInvalid={!!errors.userEmail}
                errorMessage={errors.userEmail?.message}
            />

            {/* 이름 */}
            <Input
                {...register('userName', {
                    required: '이름을 입력해주세요.',
                    minLength: { value: 2, message: '이름은 2자 이상이어야 합니다.' }
                })}
                className="w-full max-w-[350px]"
                label="이름"
                placeholder="이름을 입력하세요"
                type="text"
                maxLength={20}
                isInvalid={!!errors.userName}
                errorMessage={errors.userName?.message}
            />

            {/* 비밀번호 */}
            <Input
                {...register('userPwd', {
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
                isInvalid={!!errors.userPwd}
                errorMessage={errors.userPwd?.message}
            />

            {/* 비밀번호 확인 */}
            <Input
                {...register('userPwdConfirm', {
                    required: '비밀번호 확인을 입력해주세요.',
                    validate: (value) => value === password || '비밀번호가 일치하지 않습니다.'
                })}
                className="w-full max-w-[350px]"
                label="비밀번호 확인"
                placeholder="비밀번호를 다시 입력하세요"
                type="password"
                maxLength={30}
                isInvalid={!!errors.userPwdConfirm}
                errorMessage={errors.userPwdConfirm?.message}
            />
        </div>

        {/* 고양이 정보 섹션 */}
        <div className="w-full max-w-[350px] mt-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">우리 고양이 소개 (선택)</h2>
                <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    onClick={addCat}
                    type="button"
                >
                    + 고양이 추가
                </Button>
            </div>

            {cats.length === 0 && (
                <div className="text-sm text-gray-500 text-center py-4">
                    고양이 정보를 추가해주세요 (선택사항)
                </div>
            )}

            {cats.map((cat, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-sm">고양이 #{index + 1}</h3>
                        <Button
                            size="sm"
                            color="danger"
                            variant="light"
                            onClick={() => removeCat(index)}
                            type="button"
                        >
                            삭제
                        </Button>
                    </div>

                    <div className="flex flex-col gap-3">
                        {/* 이름 */}
                        <Input
                            label="이름"
                            placeholder="고양이 이름"
                            value={cat.catName}
                            onChange={(e) => updateCat(index, 'catName', e.target.value)}
                            size="sm"
                        />

                        {/* 생일 */}
                        <Input
                            label="생일"
                            placeholder="YYYY-MM-DD"
                            type="date"
                            value={cat.catBirth}
                            onChange={(e) => updateCat(index, 'catBirth', e.target.value)}
                            size="sm"
                        />

                        {/* 성별 */}
                        <Select
                            label="성별"
                            placeholder="성별 선택"
                            selectedKeys={cat.catGender ? [cat.catGender] : []}
                            onChange={(e) => updateCat(index, 'catGender', e.target.value)}
                            size="sm"
                        >
                            <SelectItem key="male" textValue="남아">남아</SelectItem>
                            <SelectItem key="female" textValue="여아">여아</SelectItem>
                        </Select>

                        {/* 종 */}
                        <Input
                            label="품종"
                            placeholder="예: 코리안 숏헤어"
                            value={cat.catBreed}
                            onChange={(e) => updateCat(index, 'catBreed', e.target.value)}
                            size="sm"
                        />
                    </div>
                </div>
            ))}
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

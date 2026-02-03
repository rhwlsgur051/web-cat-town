'use client'

import { useState, useRef, useEffect } from 'react';
import { Button, Card, CardBody, Avatar, Input, Spinner } from '@heroui/react';
import { useAppSelector, useAppDispatch } from '@/stores/hooks';
import { clearUser, updateUserAvatar } from '@/stores/user-slice';
import { clearTokens } from '@/lib/utils/token';
import { userApi, User } from '@/lib/api/user';
import { useRouter } from 'next/navigation';

export const MyPage = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [userInfo, setUserInfo] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string>('/user.png');

    // 로그아웃 처리
    const handleLogout = () => {
        clearTokens(); // 토큰 삭제
        dispatch(clearUser()); // Redux 상태 초기화
        router.push('/login');
    };

    // 회원탈퇴 처리
    const handleDeleteAccount = async () => {
        if (!userInfo) return;

        // 확인 메시지
        const confirmMessage = '정말로 회원 탈퇴하시겠습니까?\n\n탈퇴 시 모든 데이터(프로필, 피드, 댓글 등)가 삭제되며 복구할 수 없습니다.';
        if (!confirm(confirmMessage)) {
            return;
        }

        // 재확인
        const reconfirm = confirm('정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
        if (!reconfirm) {
            return;
        }

        try {
            setLoading(true);
            await userApi.deleteUser(userInfo.userNo);
            
            // 토큰 및 상태 초기화
            clearTokens();
            dispatch(clearUser());
            
            alert('회원 탈퇴가 완료되었습니다.');
            router.push('/login');
        } catch (error) {
            console.error('회원 탈퇴 실패:', error);
            alert('회원 탈퇴에 실패했습니다. 다시 시도해주세요.');
            setLoading(false);
        }
    };

    // 사용자 정보 불러오기
    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!user.userNo) {
                router.push('/login');
                return;
            }

            try {
                const data = await userApi.getUser(user.userNo);
                setUserInfo(data);
                if (data.userAvatarUrl) {
                    setAvatarPreview(data.userAvatarUrl);
                }
            } catch (error) {
                console.error('사용자 정보 조회 실패:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user.userId) {
            fetchUserInfo();
        } else {
            // 로그인하지 않은 경우
            router.push('/login');
        }
    }, [user.userId, user.userNo, router]);

    // 이미지 선택 버튼 클릭
    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    // 이미지 파일 선택 시
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // 이미지 파일 검증
        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 업로드 가능합니다.');
            return;
        }

        // 파일 크기 검증 (5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('파일 크기는 5MB 이하여야 합니다.');
            return;
        }

        try {
            setUploading(true);

            // 미리보기 설정
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // 서버에 업로드
            if (userInfo) {
                const updatedUser = await userApi.uploadAvatar(userInfo.userNo, file);
                setUserInfo(updatedUser);
                
                // Redux 상태 업데이트 (헤더 이미지 즉시 반영)
                dispatch(updateUserAvatar(updatedUser.userAvatarUrl || null));
                
                alert('프로필 이미지가 변경되었습니다.');
            }
        } catch (error) {
            console.error('이미지 업로드 실패:', error);
            alert('이미지 업로드에 실패했습니다.');
            // 실패 시 원래 이미지로 복원
            if (userInfo?.userAvatarUrl) {
                setAvatarPreview(userInfo.userAvatarUrl);
            } else {
                setAvatarPreview('/user.png');
            }
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!userInfo) {
        return (
            <div className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center">
                <p>사용자 정보를 불러올 수 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-[calc(100vh-80px)] flex flex-col items-center py-8 px-4">
            <div className="w-full max-w-[600px]">
                <h1 className="text-2xl font-bold mb-6">마이페이지</h1>

                {/* 프로필 카드 */}
                <Card className="mb-6">
                    <CardBody className="p-6">
                        <div className="flex flex-col items-center gap-4">
                            {/* 프로필 이미지 */}
                            <div className="relative">
                                <Avatar
                                    src={avatarPreview}
                                    className="w-32 h-32 text-large"
                                    isBordered
                                />
                                {uploading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                                        <Spinner size="sm" color="white" />
                                    </div>
                                )}
                            </div>

                            {/* 이미지 변경 버튼 */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <Button
                                size="sm"
                                variant="flat"
                                color="primary"
                                onClick={handleAvatarClick}
                                isDisabled={uploading}
                            >
                                프로필 이미지 변경
                            </Button>

                            {/* 사용자 정보 */}
                            <div className="w-full mt-4 space-y-3">
                                <Input
                                    label="아이디"
                                    value={userInfo.userId}
                                    isReadOnly
                                    variant="bordered"
                                    classNames={{
                                        input: "cursor-default",
                                        inputWrapper: "cursor-default"
                                    }}
                                />
                                <Input
                                    label="이름"
                                    value={userInfo.userName}
                                    isReadOnly
                                    variant="bordered"
                                    classNames={{
                                        input: "cursor-default",
                                        inputWrapper: "cursor-default"
                                    }}
                                />
                                <div className="relative">
                                    <Input
                                        label="이메일"
                                        value={userInfo.userEmail}
                                        isReadOnly
                                        variant="bordered"
                                        classNames={{
                                            input: "cursor-default",
                                            inputWrapper: "cursor-default"
                                        }}
                                    />
                                    {/* 회원탈퇴 버튼 */}
                                    <Button
                                        size="sm"
                                        color="danger"
                                        variant="light"
                                        onClick={handleDeleteAccount}
                                        className="absolute right-0 -bottom-8 text-xs"
                                        isDisabled={loading}
                                    >
                                        회원탈퇴
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* 추가 기능 버튼들 */}
                <div className="flex flex-col gap-3 mt-8">
                    <Button
                        color="default"
                        variant="bordered"
                        onClick={() => router.push('/')}
                    >
                        홈으로 돌아가기
                    </Button>
                    <Button
                        color="danger"
                        variant="flat"
                        onClick={handleLogout}
                    >
                        로그아웃
                    </Button>
                </div>
            </div>
        </div>
    );
};

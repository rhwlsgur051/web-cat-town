'use client'
import { useState } from "react";
import { Button, Textarea } from "@heroui/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { feedApi, CreateFeedRequest } from "@/lib/api/feed";

export const WriteFeedPage = () => {
    const router = useRouter();
    const [errMsg, setErrMsg] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const { register, handleSubmit, watch, formState: { errors, isValid } } = useForm<CreateFeedRequest>({
        mode: 'onChange',
        defaultValues: {
            feedContent: '',
            feedImageUrl: ''
        }
    });

    const content = watch('feedContent');

    // 피드 작성 Mutation
    const createFeedMutation = useMutation({
        mutationFn: feedApi.createFeed,
        onSuccess: () => {
            // 피드 작성 성공 시 메인 페이지로 이동
            router.push('/');
        },
        onError: (error: any) => {
            console.error('피드 작성 실패:', error);
            setErrMsg(error?.message || '피드 작성에 실패했습니다.');
        },
    });

    // 이미지 선택 핸들러
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // 이미지 미리보기
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setImageFile(file);
        }
    };

    // 이미지 삭제 핸들러
    const handleRemoveImage = () => {
        setImagePreview(null);
        setImageFile(null);
    };

    const onSubmit = async (data: CreateFeedRequest) => {
        try {
            setErrMsg('');

            // TODO: 이미지 업로드 로직 추가 (S3, Cloudinary 등)
            // 현재는 이미지 URL을 직접 입력받거나, 
            // 이미지 파일 업로드 후 URL을 받아와서 feedImageUrl에 설정
            
            createFeedMutation.mutate(data);
        } catch (error) {
            console.error('Submit error:', error);
        }
    };

    return (
        <form className='max-w-[600px] w-full flex flex-col gap-4 items-center mt-12 px-4' onSubmit={handleSubmit(onSubmit)}>
            {/* 헤더 */}
            <div className="w-full flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">글쓰기</h1>
                <Button 
                    color="default" 
                    variant="light"
                    onClick={() => router.back()}
                    type="button"
                >
                    취소
                </Button>
            </div>

            <div className="flex flex-col gap-4 w-full">
                {/* 내용 입력 */}
                <Textarea 
                    {...register('feedContent', { 
                        required: '내용을 입력해주세요.',
                        minLength: { value: 1, message: '최소 1자 이상 입력해주세요.' },
                        maxLength: { value: 1000, message: '최대 1000자까지 입력 가능합니다.' }
                    })} 
                    label="내용" 
                    placeholder="집사들과 공유하고 싶은 이야기를 적어주세요 🐱" 
                    minRows={10}
                    maxRows={20}
                    isInvalid={!!errors.feedContent}
                    errorMessage={errors.feedContent?.message}
                    description={`${content?.length || 0} / 1000자`}
                />

                {/* 이미지 업로드 */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold">이미지 (선택)</label>
                    
                    {imagePreview ? (
                        <div className="relative w-full">
                            <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="w-full max-h-[400px] object-cover rounded-lg"
                            />
                            <Button 
                                color="danger" 
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={handleRemoveImage}
                                type="button"
                            >
                                삭제
                            </Button>
                        </div>
                    ) : (
                        <label className="w-full h-[200px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                            <input 
                                type="file" 
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                            <div className="text-center">
                                <p className="text-gray-500">클릭하여 이미지 업로드</p>
                                <p className="text-sm text-gray-400 mt-1">JPG, PNG, GIF 등</p>
                            </div>
                        </label>
                    )}
                </div>
            </div>

            {/* 작성 버튼 */}
            <Button 
                type="submit" 
                color="primary" 
                className="w-full" 
                isDisabled={!isValid || createFeedMutation.isPending}
                isLoading={createFeedMutation.isPending}
                size="lg"
            >
                {createFeedMutation.isPending ? '작성 중...' : '작성 완료'}
            </Button>

            {/* Error Message */}
            {errMsg && (
                <div className="text-red-500 text-sm">
                    {errMsg}
                </div>
            )}
        </form>
    );
};

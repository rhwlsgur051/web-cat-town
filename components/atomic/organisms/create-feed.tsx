'use client'
import { useState, useRef } from "react";
import { Button, Textarea } from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { feedApi, CreateFeedRequest } from "@/lib/api/feed";
import ModalContainer from "@/components/client-components/modals/modal-container";

export const CreateFeed = ({ onCreatedFeed }: { onCreatedFeed: (feed: any) => void }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const { handleSubmit, setValue, reset, control, formState: { isValid } } = useForm<CreateFeedRequest>({
        mode: 'onChange',
        defaultValues: {
            feedContent: '',
            image: null,
            feedType: 'daily', // 일상 페이지에서 생성 시 기본값
        }
    });

    // 피드 작성 Mutation
    const createFeedMutation = useMutation({
        mutationFn: feedApi.createFeed,
        onSuccess: ({ feed }) => {
            // 피드 작성 성공 시 모달 종료
            onCreatedFeed(feed);
            onClose();
        },
        onError: (error: any) => {
            console.error('피드 작성 실패:', error);
            alert('피드 작성에 실패했습니다. 다시 시도해주세요.');
            onClose();
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
            setValue('image', file);
        }
    };

    const onSubmit = async (data: CreateFeedRequest) => {
        try {
            // FormData 생성 (이미지 파일 포함)
            const formData = new FormData();
            formData.append('feedContent', data.feedContent);
            formData.append('image', data.image!);
            formData.append('feedType', (data.feedType ?? 'daily') as string);
            createFeedMutation.mutate(formData as any);
        } catch (error) {
            console.error('Submit error:', error);
        }
    };

    // 생성 모달 종료 시 실행
    const onClose = () => {
        setIsModalOpen(false);
        handleImageDelete();
        reset(); // form 초기화
    }

    const handleImageDelete = () => {
        setImagePreview(null);
        setValue('image', null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    return <>
        <div>
            <div className="text-lg font-bold mb-2">
                🐱 오늘 고양이와 무슨일이 있었나요?
            </div>
            <Button color="primary" onPress={() => setIsModalOpen(true)}>집사들의 일상을 공유해보세요</Button>
        </div>
        <ModalContainer open={isModalOpen} onClose={onClose}>
            <form className={`w-full flex flex-col gap-4 items-center px-4`} onSubmit={handleSubmit(onSubmit)}>
                {/* 헤더 */}
                <div className="w-full grid grid-cols-3 items-center mb-4">
                    <div className="flex justify-start">{imagePreview ?
                        <button
                            type="button"
                            onClick={handleImageDelete}
                            aria-label="이미지 재업로드"
                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-black/30 duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5" />
                                <path d="m12 19-7-7 7-7" />
                            </svg>
                        </button> : ''}</div>
                    <div className="text-xl font-bold text-center">일상 공유하기</div>
                    <div className="flex justify-end font-bold">
                        {/* 작성 버튼 */}
                        {imagePreview && <Button
                            type="submit"
                            color="primary"
                            isDisabled={!isValid || createFeedMutation.isPending}
                            isLoading={createFeedMutation.isPending}
                            size="md"
                        >
                            {createFeedMutation.isPending ? '작성 중...' : '등록'}
                        </Button>}

                    </div>
                </div>

                <div className="flex gap-4 w-full">
                    {/* 이미지 업로드 영역 */}
                    <div className="min-w-[300px]">
                        <input
                            ref={fileInputRef}
                            id="feed-image-input"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />

                        {imagePreview ? (
                            <div className="relative w-full overflow-hidden rounded-lg aspect-square border-gray-300 border-1">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="absolute top-0 left-0 w-full h-full object-contain"
                                />
                            </div>
                        ) : (
                            <label htmlFor="feed-image-input" className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                                <div className="text-center">
                                    <p className="text-gray-500">클릭하여 이미지 업로드</p>
                                    <p className="text-sm text-gray-400 mt-1">JPG, PNG, GIF 등</p>
                                    <p className="text-sm text-gray-400 mt-1">권장 이미지 비율 1:1</p>
                                </div>
                            </label>
                        )}
                    </div>

                    {/* 내용 입력 */}
                    {imagePreview &&
                        <Controller
                            name="feedContent"
                            control={control}
                            rules={{
                                required: '내용을 입력해주세요.',
                                minLength: { value: 1, message: '최소 1자 이상 입력해주세요.' },
                            }}
                            render={({ field, fieldState }) => (
                                <Textarea
                                    value={field.value ?? ''}
                                    onValueChange={(v) => {
                                        const next = (v ?? '').length > 200 ? (v ?? '').slice(0, 200) : (v ?? '');
                                        field.onChange(next);
                                    }}
                                    onBlur={field.onBlur}
                                    label="내용"
                                    placeholder="집사들과 공유하고 싶은 이야기를 적어주세요 🐱"
                                    disableAutosize
                                    classNames={{ input: 'min-h-[200px] overflow-y-auto' }}
                                    isInvalid={!!fieldState.error}
                                    errorMessage={fieldState.error?.message}
                                    description={`${(field.value ?? '').length} / 200자`}
                                />
                            )}
                        />
                    }
                </div>
            </form>
        </ModalContainer>
    </>
}
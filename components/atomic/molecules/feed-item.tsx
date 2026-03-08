'use client'

import { useState, memo } from "react";
import { Card, CardBody, CardFooter, CardHeader, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { UserAvatar } from "@/components/atomic/atoms/user-avatar";
import { useAppSelector } from "@/stores/hooks";
import { feedApi } from "@/lib/api/feed";

interface PostCardProps {
    id: number;
    author: {
        name: string;
        avatar: string;
        userNo: number;
    };
    content: string;
    image?: string;
    likes: number;
    /** 현재 사용자가 이 피드에 좋아요를 눌렀는지 */
    isLiked?: boolean;
    comments: number;
    createdAt: string;
    onDelete?: (feedNo: number) => void;
    /** 좋아요 토글 후 부모 목록 갱신용 (feedNo, liked) */
    onLikeToggled?: (feedNo: number, liked: boolean) => void;
}

export const FeedItem = memo(({ id, author, content, image, likes, isLiked = false, comments, createdAt, onDelete, onLikeToggled }: PostCardProps) => {
    const currentUserNo = useAppSelector((state) => state.user.userNo);
    const isMyPost = currentUserNo === author.userNo;
    const [deleting, setDeleting] = useState(false);
    const [liking, setLiking] = useState(false);

    const handleDelete = async () => {
        if (!confirm('정말 이 피드를 삭제하시겠습니까?')) {
            return;
        }

        try {
            setDeleting(true);
            await feedApi.deleteFeed(id);
            if (onDelete) {
                onDelete(id);
            }
        } catch (error) {
            console.error('피드 삭제 실패:', error);
            alert('피드 삭제에 실패했습니다.');
        } finally {
            setDeleting(false);
        }
    };

    const handleLikeClick = async () => {
        if (liking) return;
        try {
            setLiking(true);
            const res = await feedApi.toggleLike(id);
            onLikeToggled?.(id, res.liked);
        } catch (error) {
            console.error('좋아요 토글 실패:', error);
            alert('좋아요 처리에 실패했습니다.');
        } finally {
            setLiking(false);
        }
    };

    return (
        <div className="w-[500px]">
            {/* 작성자 정보 */}
            <div className="flex gap-3 justify-between">
                <div className="flex gap-3">
                    <UserAvatar
                        src={author.avatar}
                        name={author.name}
                        size="md"
                    />
                    <div className="flex flex-col">
                        <p className="text-md font-semibold">{author.name}</p>
                        <p className="text-small text-default-500">{createdAt}</p>
                    </div>
                </div>

                {/* 내 글일 경우 드롭다운 메뉴 */}
                {isMyPost && (
                    <Dropdown>
                        <DropdownTrigger>
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                isDisabled={deleting}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="피드 관리">
                            <DropdownItem
                                key="delete"
                                className="text-danger"
                                color="danger"
                                onClick={handleDelete}
                            >
                                삭제
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                )}
            </div>

            {/* 게시글 내용 */}
            <div className="text-small">
                <p className="py-2 whitespace-pre-wrap">
                    {content}
                </p>
            </div>

            {/* 이미지 */}
            <div className="py-2">
                <div className="relative w-full overflow-hidden border-1 border-slate-100 rounded-lg">
                    <img
                        alt="게시글 이미지"
                        className="object-contain w-full h-full object-center"
                        src={image}
                    />
                </div>
            </div>

            {/* 좋아요/댓글 */}
            <div className="gap-3 py-3">
                <div className="flex gap-4">
                    <Button
                        size="sm"
                        variant="light"
                        isDisabled={liking}
                        onPress={handleLikeClick}
                        startContent={
                            isLiked ? (
                                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            )
                        }
                    >
                        좋아요 {likes}
                    </Button>
                    <Button
                        size="sm"
                        variant="light"
                        startContent={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        }
                    >
                        댓글 {comments}
                    </Button>
                </div>
            </div>
        </div>
    );
});

FeedItem.displayName = 'FeedItem';

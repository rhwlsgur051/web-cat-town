'use client'

import { Card, CardBody, CardFooter, CardHeader, Image, Avatar, Button } from "@heroui/react";
import Link from "next/link";

interface PostCardProps {
    id: number;
    author: {
        name: string;
        avatar: string;
    };
    content: string;
    image?: string;
    likes: number;
    comments: number;
    createdAt: string;
}

export const PostCard = ({ id, author, content, image, likes, comments, createdAt }: PostCardProps) => {
    return (
        <Card className="w-full max-w-[600px] shadow-sm">
            {/* 작성자 정보 */}
            <CardHeader className="flex gap-3">
                <Avatar 
                    isBordered 
                    radius="full" 
                    size="md" 
                    src={author.avatar} 
                    name={author.name}
                />
                <div className="flex flex-col">
                    <p className="text-md font-semibold">{author.name}</p>
                    <p className="text-small text-default-500">{createdAt}</p>
                </div>
            </CardHeader>

            {/* 게시글 내용 */}
            <CardBody className="px-3 py-0 text-small">
                <p className="py-2 whitespace-pre-wrap">
                    {content}
                </p>
            </CardBody>

            {/* 이미지 */}
            {image && (
                <div className="px-3 py-2">
                    <Image
                        alt="게시글 이미지"
                        className="object-cover rounded-lg w-full"
                        src={image}
                        width="100%"
                    />
                </div>
            )}

            {/* 좋아요/댓글 */}
            <CardFooter className="gap-3 px-4 py-3">
                <div className="flex gap-4">
                    <Button 
                        size="sm" 
                        variant="light" 
                        startContent={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
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
            </CardFooter>
        </Card>
    );
};

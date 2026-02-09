'use client'

import { Avatar } from "@heroui/react";

interface UserAvatarProps {
    src: string;
    name: string;
    size?: "sm" | "md" | "lg";
    isBordered?: boolean;
}

/**
 * 유저 프로필 이미지를 표시하는 Atom 컴포넌트
 * 피드, 댓글, 프로필 등 다양한 곳에서 재사용 가능
 */
export const UserAvatar = ({ 
    src, 
    name, 
    size = "md", 
    isBordered = true 
}: UserAvatarProps) => {
    return (
        <Avatar 
            isBordered={isBordered}
            radius="full" 
            size={size} 
            src={src} 
            name={name}
        />
    );
};

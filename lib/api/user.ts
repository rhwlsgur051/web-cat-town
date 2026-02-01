// lib/api/user.ts
import { apiClient } from './client';

export interface User {
    userNo: number;
    userId: string;
    userEmail: string;
    userName: string;
    userAvatarUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateUserRequest {
    userId?: string;
    userEmail?: string;
    userPwd?: string;
    userName?: string;
}

export interface UserResponse {
    success: boolean;
    message: string;
    user?: User;
}

export const userApi = {
    // 사용자 정보 조회
    getUser: async (userNo: number): Promise<User> => {
        return apiClient.get<User>(`/users/${userNo}`);
    },

    // 사용자 정보 수정
    updateUser: async (userNo: number, data: UpdateUserRequest): Promise<User> => {
        return apiClient.put<User>(`/users/${userNo}`, data);
    },

    // 프로필 이미지 업로드/교체
    uploadAvatar: async (userNo: number, file: File): Promise<User> => {
        const formData = new FormData();
        formData.append('image', file);
        return apiClient.put<User>(`/users/${userNo}/image`, formData);
    },
};

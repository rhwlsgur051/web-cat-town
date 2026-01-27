// lib/api/auth.ts
import { apiClient } from './client';

export interface JoinRequest {
    userId: string;
    userEmail: string;
    userPwd: string;
    userName: string;
    cats?: Array<{
        catName: string;
        catBirth: string;
        catGender: 'male' | 'female';
        catBreed: string;
    }>;
}

export interface LoginRequest {
    userId: string;
    userPwd: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user?: {
        userId: string;
        userEmail: string;
        userName: string;
    };
    accessToken?: string;
    refreshToken?: string;
}

export const authApi = {
    // 회원가입
    join: async (data: JoinRequest): Promise<AuthResponse> => {
        return apiClient.post<AuthResponse>('/users', data);
    },

    // 로그인
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        return apiClient.post<AuthResponse>('/auth/login', data);
    },

    // 로그아웃
    logout: async (): Promise<void> => {
        return apiClient.post<void>('/auth/logout');
    },

    // 현재 사용자 정보
    me: async (): Promise<AuthResponse> => {
        return apiClient.get<AuthResponse>('/auth/me');
    },
};
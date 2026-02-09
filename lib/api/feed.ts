// lib/api/feed.ts
import { apiClient } from './client';

/** 피드 타입: 일상(daily), 건강(health), 질문(question) */
export type FeedType = 'daily' | 'health' | 'question';

export interface CreateFeedRequest {
    feedContent: string;
    image: File | null;
    /** 미입력 시 일상 페이지에서는 'daily' */
    feedType?: FeedType;
}

export interface UpdateFeedRequest {
    feedContent?: string;
    image: File | null;
    feedType?: FeedType;
}

export interface FeedResponse {
    success: boolean;
    message: string;
    feed?: {
        feedNo: number;
        feedContent: string;
        feedImageUrl: string; // 필수
        feedType: FeedType;
        likeCount?: number;
        isLiked?: boolean;
        createdAt: string;
        updatedAt: string;
        user: {
            userNo: number;
            userId: string;
            userName: string;
            userAvatarUrl?: string;
        };
    };
}

export interface FeedsListResponse {
    success: boolean;
    message: string;
    feeds: Omit<FeedResponse, 'success' | 'message'>[];
    total: number;
    page: number;
    limit: number;
}

const url = '/feeds';

export const feedApi = {
    // 피드 작성 (FormData 지원)
    createFeed: async (data: CreateFeedRequest | FormData): Promise<FeedResponse> => {
        return apiClient.post<FeedResponse>(url, data);
    },

    // 피드 목록 조회 (페이지네이션)
    getFeeds: async (page: number = 1, limit: number = 10): Promise<FeedsListResponse> => {
        return apiClient.get<FeedsListResponse>(`${url}?page=${page}&limit=${limit}`);
    },

    // 특정 피드 조회
    getFeed: async (feedNo: number): Promise<FeedResponse> => {
        return apiClient.get<FeedResponse>(`${url}/${feedNo}`);
    },

    // 피드 수정 (FormData 지원)
    updateFeed: async (feedNo: number, data: UpdateFeedRequest | FormData): Promise<FeedResponse> => {
        return apiClient.put<FeedResponse>(`${url}/${feedNo}`, data);
    },

    // 피드 삭제
    deleteFeed: async (feedNo: number): Promise<void> => {
        return apiClient.delete<void>(`${url}/${feedNo}`);
    },

    // 피드 좋아요
    likeFeed: async (feedNo: number): Promise<FeedResponse> => {
        return apiClient.post<FeedResponse>(`${url}/${feedNo}/like`);
    },

    // 내가 작성한 피드 목록
    getMyFeeds: async (page: number = 1, limit: number = 10): Promise<FeedsListResponse> => {
        return apiClient.get<FeedsListResponse>(`${url}/my?page=${page}&limit=${limit}`);
    },
};

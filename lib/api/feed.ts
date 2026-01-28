// lib/api/feed.ts
import { apiClient } from './client';

export interface CreateFeedRequest {
    feedContent: string;
    feedImageUrl?: string;
}

export interface UpdateFeedRequest {
    feedContent?: string;
    feedImageUrl?: string;
}

export interface FeedResponse {
    success: boolean;
    message: string;
    feed?: {
        feedNo: number;
        feedContent: string;
        feedImageUrl?: string;
        feedLikes: number;
        createdAt: string;
        updatedAt: string;
        user: {
            userNo: number;
            userId: string;
            userName: string;
        };
    };
}

export interface FeedsListResponse {
    success: boolean;
    message: string;
    feeds: Array<{
        feedNo: number;
        feedContent: string;
        feedImageUrl?: string;
        feedLikes: number;
        createdAt: string;
        user: {
            userNo: number;
            userId: string;
            userName: string;
        };
    }>;
    total: number;
    page: number;
    limit: number;
}

export const feedApi = {
    // 피드 작성
    createFeed: async (data: CreateFeedRequest): Promise<FeedResponse> => {
        return apiClient.post<FeedResponse>('/feeds', data);
    },

    // 피드 목록 조회 (페이지네이션)
    getFeeds: async (page: number = 1, limit: number = 10): Promise<FeedsListResponse> => {
        return apiClient.get<FeedsListResponse>(`/feeds?page=${page}&limit=${limit}`);
    },

    // 특정 피드 조회
    getFeed: async (feedNo: number): Promise<FeedResponse> => {
        return apiClient.get<FeedResponse>(`/feeds/${feedNo}`);
    },

    // 피드 수정
    updateFeed: async (feedNo: number, data: UpdateFeedRequest): Promise<FeedResponse> => {
        return apiClient.put<FeedResponse>(`/feeds/${feedNo}`, data);
    },

    // 피드 삭제
    deleteFeed: async (feedNo: number): Promise<void> => {
        return apiClient.delete<void>(`/feeds/${feedNo}`);
    },

    // 피드 좋아요
    likeFeed: async (feedNo: number): Promise<FeedResponse> => {
        return apiClient.post<FeedResponse>(`/feeds/${feedNo}/like`);
    },

    // 내가 작성한 피드 목록
    getMyFeeds: async (page: number = 1, limit: number = 10): Promise<FeedsListResponse> => {
        return apiClient.get<FeedsListResponse>(`/feeds/my?page=${page}&limit=${limit}`);
    },
};

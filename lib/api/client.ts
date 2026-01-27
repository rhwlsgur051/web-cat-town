// lib/api/client.ts
import { getAccessToken, clearTokens } from '@/lib/utils/token';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * 공통 헤더 생성 (Access Token 자동 포함)
 */
const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const accessToken = getAccessToken();
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return headers;
};

/**
 * 공통 에러 처리
 */
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    // 401 Unauthorized - 토큰 만료 또는 인증 실패
    if (response.status === 401) {
      clearTokens();
      
      // Redux 상태도 초기화 (localStorage persist도 함께 삭제)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('persist:root'); // redux-persist 초기화
        window.location.href = '/login';
      }
    }

    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const apiClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<T>(response);
  },

  post: async <T>(endpoint: string, data?: any): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include',
      body: data ? JSON.stringify(data) : undefined,
    });

    return handleResponse<T>(response);
  },

  put: async <T>(endpoint: string, data?: any): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      credentials: 'include',
      body: data ? JSON.stringify(data) : undefined,
    });

    return handleResponse<T>(response);
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include',
    });

    return handleResponse<T>(response);
  },
};
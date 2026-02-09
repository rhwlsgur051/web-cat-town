// lib/api/client.ts
import { getAccessToken, getRefreshToken, setAccessToken, clearTokens } from '@/lib/utils/token';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// 토큰 갱신 중인지 추적하는 플래그
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

/**
 * 공통 헤더 생성 (Access Token 자동 포함)
 */
const getHeaders = (isFormData: boolean = false): HeadersInit => {
  const headers: HeadersInit = {};

  // FormData가 아닐 때만 Content-Type 설정 (FormData는 브라우저가 자동 설정)
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const accessToken = getAccessToken();
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return headers;
};

/**
 * Refresh Token으로 새 Access Token 발급
 */
const refreshAccessToken = async (): Promise<string | null> => {
  // 이미 갱신 중이면 기존 Promise 반환
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error('Refresh Token이 없습니다.');
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('토큰 갱신 실패');
      }

      const data = await response.json();
      const newAccessToken = data.accessToken;

      // 새 Access Token 저장
      setAccessToken(newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error('토큰 갱신 실패:', error);
      
      // 갱신 실패 시 모든 토큰 삭제
      clearTokens();
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('persist:root');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

/** 토큰 정리 후 로그인 페이지로 이동 (401 시 공통) */
const redirectToLogin = () => {
  clearTokens();
  if (typeof window !== 'undefined') {
    localStorage.removeItem('persist:root');
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }
};

/**
 * 공통 에러 처리
 */
const handleResponse = async <T>(response: Response, retryRequest?: () => Promise<Response>): Promise<T> => {
  if (!response.ok) {
    // 401 Unauthorized - 토큰 만료 또는 인증 실패
    if (response.status === 401 && retryRequest) {
      // Refresh Token으로 Access Token 갱신 시도
      const newAccessToken = await refreshAccessToken();
      
      if (newAccessToken) {
        // 새 토큰으로 원래 요청 재시도
        const retryResponse = await retryRequest();
        if (retryResponse.ok) {
          return retryResponse.json();
        }
      }
      
      redirectToLogin();
    }

    // 401인데 위에서 리다이렉트 안 했으면 여기서 로그인으로 (retry 없거나 재시도 실패 등)
    if (response.status === 401) {
      redirectToLogin();
    }

    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const apiClient = {
  get: async <T>(endpoint: string): Promise<T> => {
    const makeRequest = () => fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
      credentials: 'include',
    });

    const response = await makeRequest();
    return handleResponse<T>(response, makeRequest);
  },

  post: async <T>(endpoint: string, data?: any): Promise<T> => {
    const isFormData = data instanceof FormData;
    const makeRequest = () => fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(isFormData),
      credentials: 'include',
      body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
    });

    const response = await makeRequest();
    return handleResponse<T>(response, makeRequest);
  },

  put: async <T>(endpoint: string, data?: any): Promise<T> => {
    const isFormData = data instanceof FormData;
    const makeRequest = () => fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(isFormData),
      credentials: 'include',
      body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
    });

    const response = await makeRequest();
    return handleResponse<T>(response, makeRequest);
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const makeRequest = () => fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
      credentials: 'include',
    });

    const response = await makeRequest();
    return handleResponse<T>(response, makeRequest);
  },
};
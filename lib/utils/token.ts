// 토큰 관리 유틸리티

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * Access Token 저장
 */
export const setAccessToken = (token: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
    }
};

/**
 * Refresh Token 저장
 */
export const setRefreshToken = (token: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
    }
};

/**
 * 두 토큰을 한 번에 저장
 */
export const setTokens = (accessToken: string, refreshToken: string): void => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
};

/**
 * Access Token 가져오기
 */
export const getAccessToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    }
    return null;
};

/**
 * Refresh Token 가져오기
 */
export const getRefreshToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    }
    return null;
};

/**
 * Access Token 삭제
 */
export const removeAccessToken = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
};

/**
 * Refresh Token 삭제
 */
export const removeRefreshToken = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
};

/**
 * 모든 토큰 삭제 (로그아웃 시)
 */
export const clearTokens = (): void => {
    removeAccessToken();
    removeRefreshToken();
};

/**
 * 토큰이 존재하는지 확인
 */
export const hasTokens = (): boolean => {
    return !!getAccessToken() && !!getRefreshToken();
};

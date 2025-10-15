import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { BACKEND_URL } from '@/constants';
import { getCookie, setCookie } from 'cookies-next';
import { useAuthStore } from '@/store/auth-store';

type RetriableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const axiosInstance = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true,
    timeout: 20000,
});

let refreshPromise: Promise<string | null> | null = null;

const getStoredToken = () => {
    if (typeof window === 'undefined') {
        return undefined;
    }
    return getCookie('auth_token') as string | undefined;
};

const refreshAccessToken = async (): Promise<string | null> => {
    if (!refreshPromise) {
        refreshPromise = axios
            .post(`${BACKEND_URL}/auth/refresh-token`, undefined, {
                withCredentials: true,
            })
            .then((response) => {
                const token: string | undefined = response.data?.data?.access_token;
                if (token) {
                    const authHeader = `Bearer ${token}`;
                    if (typeof window !== 'undefined') {
                        setCookie('auth_token', authHeader);
                    }
                    axiosInstance.defaults.headers.common['Authorization'] = authHeader;
                    return authHeader;
                }
                return null;
            })
            .catch((error) => {
                // If refresh fails, clear the token and user data
                if (typeof window !== 'undefined') {
                    // Clear localStorage user data
                    localStorage.removeItem('user_data');
                }
                return null;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
};

const shouldSkipAuth = (url?: string) => {
    if (!url) return false;
    return [
        '/categories', // Public category endpoints
    ].some((endpoint) => url.includes(endpoint));
};

axiosInstance.interceptors.request.use(
    (config) => {
        const token = getStoredToken();
        if (token && !shouldSkipAuth(config.url)) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const shouldBypassRefresh = (url?: string) => {
    if (!url) return false;
    return [
        '/auth/login',
        '/auth/register',
        '/auth/refresh-token',
        '/auth/logout',
    ].some((endpoint) => url.includes(endpoint));
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { response, config } = error || {};
        const originalRequest = config as RetriableRequestConfig | undefined;

        if (
            response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !shouldBypassRefresh(originalRequest.url)
        ) {
            originalRequest._retry = true;

            try {
                const newToken = await refreshAccessToken();

                if (!newToken) {
                    // Refresh failed, logout user
                    useAuthStore.getState().forceLogout();
                    return Promise.reject(error);
                }

                // Retry the original request with new token
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers['Authorization'] = newToken;

                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // Refresh failed, logout user
                useAuthStore.getState().forceLogout();
                return Promise.reject(refreshError);
            }
        }

        if (response && response.data && response.data.api_error) {
            throw response.data.api_error;
        }

        throw error;
    }
);

export default axiosInstance;

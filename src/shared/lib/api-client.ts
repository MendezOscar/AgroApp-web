import axios, { type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/shared/store/auth-store';

const baseURL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://agroapp-backend-production-498f.up.railway.app/api';

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().session?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

interface RefreshResponse {
  accessToken?: string;
  token?: string;
  refreshToken: string;
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const session = useAuthStore.getState().session;
  if (!session?.refreshToken) return null;

  try {
    const refreshClient = axios.create({ baseURL, headers: { 'Content-Type': 'application/json' } });
    const { data } = await refreshClient.post<RefreshResponse>('/auth/refresh', {
      refreshToken: session.refreshToken,
    });
    const newToken = data.accessToken ?? data.token;
    if (!newToken) return null;
    useAuthStore.getState().updateTokens(newToken, data.refreshToken);
    return newToken;
  } catch {
    return null;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
      const newToken = await refreshPromise;

      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original);
      }
      useAuthStore.getState().setSession(null);
    }

    return Promise.reject(error);
  },
);

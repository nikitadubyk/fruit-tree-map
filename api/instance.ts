import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';

import { URL } from '@/config';
import { getToken, clearAll, saveTokens } from '@/utils';

const API_URL = process.env.NEXT_PUBLIC_APP_URL;

export const api = axios.create({ baseURL: API_URL });

let isRefreshing = false;

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getToken('refreshToken');
        if (!refreshToken) {
          clearAll();
          return Promise.reject(error);
        }

        const { data } = await axios.post(`${API_URL}${URL.REFRESH_TOKEN}`, {
          refreshToken,
        });

        saveTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${data.accessToken}`,
        };

        isRefreshing = false;
        return api(originalRequest);
      } catch (e) {
        isRefreshing = false;
        clearAll();
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

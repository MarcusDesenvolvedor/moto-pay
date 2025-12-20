import axios, { AxiosInstance, AxiosError } from 'axios';
import { getToken, clearTokens } from '../storage/token-storage';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

console.log('[API] Base URL configurada:', API_BASE_URL);

export class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      async (config) => {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[API] Request error:', error);
        return Promise.reject(error);
      },
    );

    this.client.interceptors.response.use(
      (response) => {
        console.log(`[API] ${response.status} ${response.config.url}`);
        return response;
      },
      async (error: AxiosError) => {
        if (error.response) {
          console.error(
            `[API] Error ${error.response.status} ${error.config?.url}:`,
            error.response.data,
          );
        } else if (error.request) {
          console.error('[API] Network error - no response received:', {
            url: error.config?.url,
            baseURL: error.config?.baseURL,
          });
        } else {
          console.error('[API] Error setting up request:', error.message);
        }

        if (error.response?.status === 401) {
          await clearTokens();
        }
        return Promise.reject(error);
      },
    );
  }

  get instance(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient();

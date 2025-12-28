import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getToken, getRefreshToken, saveAccessToken, clearTokens } from '../storage/token-storage';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

console.log('[API] Base URL configurada:', API_BASE_URL);

export class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

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
    // Request interceptor: attach access token
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

    // Response interceptor: handle 401 and auto-refresh
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[API] ${response.status} ${response.config.url}`);
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue this request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return this.client(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = await getRefreshToken();
            
            if (!refreshToken) {
              // No refresh token, clear everything and reject
              await clearTokens();
              this.processQueue(null, new Error('No refresh token'));
              return Promise.reject(error);
            }

            // Call refresh endpoint
            const refreshResponse = await axios.post<{ data: { accessToken: string } }>(
              `${API_BASE_URL}/auth/refresh`,
              { refreshToken },
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            );

            const newAccessToken = refreshResponse.data.data.accessToken;
            
            // Save new access token
            await saveAccessToken(newAccessToken);

            // Update authorization header for the original request
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }

            // Process queued requests
            this.processQueue(newAccessToken, null);

            // Retry original request
            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh failed, clear tokens and redirect to login
            await clearTokens();
            this.processQueue(null, refreshError);
            
            // Emit event or use navigation to redirect (handled by app)
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        // Handle other errors
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

        return Promise.reject(error);
      },
    );
  }

  private processQueue(token: string | null, error: any): void {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(token);
      }
    });

    this.failedQueue = [];
  }

  get instance(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient();

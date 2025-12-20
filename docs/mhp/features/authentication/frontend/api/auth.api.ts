import { apiClient } from '../../../shared/api/api-client';
import {
  SignupRequest,
  LoginRequest,
  RefreshTokenRequest,
  AuthResponse,
  UserResponse,
  ApiResponse,
} from '../types/auth.types';

export const authApi = {
  signup: async (data: SignupRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.instance.post<ApiResponse<AuthResponse>>(
      '/auth/signup',
      data,
    );
    return response.data;
  },

  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.instance.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      data,
    );
    return response.data;
  },

  refreshToken: async (
    data: RefreshTokenRequest,
  ): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.instance.post<ApiResponse<AuthResponse>>(
      '/auth/refresh',
      data,
    );
    return response.data;
  },

  logout: async (data: RefreshTokenRequest): Promise<void> => {
    await apiClient.instance.post('/auth/logout', data);
  },

  getCurrentUser: async (): Promise<ApiResponse<UserResponse>> => {
    const response = await apiClient.instance.get<ApiResponse<UserResponse>>(
      '/auth/me',
    );
    return response.data;
  },
};


import { apiClient } from '../../../../../../../shared/api/api-client';
import {
  UpdateProfileRequest,
  UpdatePasswordRequest,
  UserProfile,
} from '../types/edit-profile.types';
import { ApiResponse, UserResponse } from '../../../../authentication/frontend/types/auth.types';
import { authApi } from '../../../../authentication/frontend/api/auth.api';

export const editProfileApi = {
  getCurrentUser: async (): Promise<ApiResponse<UserProfile>> => {
    // Reuse existing auth API and map to UserProfile
    const response = await authApi.getCurrentUser();
    return {
      data: {
        id: response.data.id,
        email: response.data.email,
        fullName: response.data.fullName,
        avatarUrl: response.data.avatarUrl || null,
        isActive: response.data.isActive,
        createdAt: response.data.createdAt,
      },
    };
  },

  updateProfile: async (
    data: UpdateProfileRequest,
  ): Promise<ApiResponse<UserProfile>> => {
    const response = await apiClient.instance.put<ApiResponse<UserResponse>>(
      '/auth/me',
      data,
    );
    // Map UserResponse to UserProfile
    return {
      data: {
        id: response.data.data.id,
        email: response.data.data.email,
        fullName: response.data.data.fullName,
        isActive: response.data.data.isActive,
        createdAt: response.data.data.createdAt,
      },
    };
  },

  updatePassword: async (
    data: UpdatePasswordRequest,
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.instance.put<ApiResponse<{ message: string }>>(
      '/auth/me/password',
      data,
    );
    return response.data;
  },

  uploadAvatar: async (
    imageBase64: string,
  ): Promise<ApiResponse<UserProfile>> => {
    const response = await apiClient.instance.post<ApiResponse<UserResponse>>(
      '/auth/me/avatar',
      { imageUrl: imageBase64 },
    );
    // Map UserResponse to UserProfile
    return {
      data: {
        id: response.data.data.id,
        email: response.data.data.email,
        fullName: response.data.data.fullName,
        avatarUrl: response.data.data.avatarUrl || null,
        isActive: response.data.data.isActive,
        createdAt: response.data.data.createdAt,
      },
    };
  },
};


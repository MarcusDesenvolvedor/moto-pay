import { apiClient } from '../../../../../../../shared/api/api-client';
import {
  UpdateProfileRequest,
  UpdatePasswordRequest,
  UserProfile,
} from '../types/edit-profile.types';
import { ApiResponse, UserResponse } from '../../../../authentication/frontend/types/auth.types';
import { authApi } from '../../../../authentication/frontend/api/auth.api';
import { uploadImageToCloudinary } from '../../../../../../../shared/services/cloudinary-upload.service';

export const editProfileApi = {
  getCurrentUser: async (): Promise<ApiResponse<UserProfile>> => {
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

  /**
   * 1. Upload da imagem para o Cloudinary (frontend)
   * 2. Envio da secure_url para o backend
   * 3. Backend atualiza avatarUrl no banco e remove imagem antiga do Cloudinary
   */
  uploadAvatar: async (
    imageUri: string,
  ): Promise<ApiResponse<UserProfile>> => {
    const secureUrl = await uploadImageToCloudinary(imageUri, 'avatars');

    const response = await apiClient.instance.put<ApiResponse<UserResponse>>(
      '/auth/me/avatar',
      { avatarUrl: secureUrl },
    );

    const user = response.data?.data ?? response.data;
    return {
      data: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl ?? null,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    };
  },
};

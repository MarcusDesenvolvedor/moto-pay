import { apiClient } from '../../../../../../shared/api/api-client';
import {
  ChangePasswordRequest,
  Session,
  ApiResponse,
} from '../types/security.types';

export const securityApi = {
  changePassword: async (
    data: ChangePasswordRequest,
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.instance.put<
      ApiResponse<{ message: string }>
    >('/auth/change-password', data);
    return response.data;
  },

  getSessions: async (): Promise<ApiResponse<Session[]>> => {
    const response = await apiClient.instance.get<ApiResponse<Session[]>>(
      '/auth/sessions',
    );
    return response.data;
  },

  logoutSession: async (
    sessionId: string,
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.instance.delete<
      ApiResponse<{ message: string }>
    >(`/auth/sessions/${sessionId}`);
    return response.data;
  },

  logoutAllSessions: async (): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.instance.delete<
      ApiResponse<{ message: string }>
    >('/auth/sessions');
    return response.data;
  },
};



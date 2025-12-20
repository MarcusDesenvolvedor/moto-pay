import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { LoginRequest, AuthResponse } from '../types/auth.types';
import { saveTokens } from '../../../shared/storage/token-storage';

export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginRequest): Promise<AuthResponse> => {
      const response = await authApi.login(data);
      await saveTokens(
        response.data.accessToken,
        response.data.refreshToken,
      );
      return response.data;
    },
  });
}


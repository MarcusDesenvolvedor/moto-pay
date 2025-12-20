import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { SignupRequest, AuthResponse } from '../types/auth.types';
import { saveTokens } from '../../../shared/storage/token-storage';

export function useSignup() {
  return useMutation({
    mutationFn: async (data: SignupRequest): Promise<AuthResponse> => {
      const response = await authApi.signup(data);
      await saveTokens(
        response.data.accessToken,
        response.data.refreshToken,
      );
      return response.data;
    },
  });
}


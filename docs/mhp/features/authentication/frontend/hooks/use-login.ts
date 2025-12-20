import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { LoginRequest, AuthResponse } from '../types/auth.types';
import { saveTokens } from '../../../../../../shared/storage/token-storage';
import { useAuthStore } from '../store/auth.store';

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (data: LoginRequest): Promise<AuthResponse> => {
      const response = await authApi.login(data);
      await saveTokens(
        response.data.accessToken,
        response.data.refreshToken,
      );
      setAuth(response.data);
      return response.data;
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
}

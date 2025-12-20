import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { SignupRequest, AuthResponse } from '../types/auth.types';
import { saveTokens } from '../../../../../../shared/storage/token-storage';
import { useAuthStore } from '../store/auth.store';

export function useSignup() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (data: SignupRequest): Promise<AuthResponse> => {
      const response = await authApi.signup(data);
      await saveTokens(
        response.data.accessToken,
        response.data.refreshToken,
      );
      setAuth(response.data);
      return response.data;
    },
    onError: (error) => {
      console.error('Signup error:', error);
    },
  });
}

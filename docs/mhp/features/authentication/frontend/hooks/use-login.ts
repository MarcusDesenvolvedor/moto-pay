import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { LoginRequest, AuthResponse } from '../types/auth.types';
import { useAuthStore } from '../store/auth.store';

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (data: LoginRequest): Promise<AuthResponse> => {
      const response = await authApi.login(data);
      // setAuth already saves tokens to secure storage
      await setAuth(response.data);
      return response.data;
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });
}

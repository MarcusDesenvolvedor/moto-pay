import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { getRefreshToken, clearTokens } from '../../../shared/storage/token-storage';

export function useLogout() {
  return useMutation({
    mutationFn: async (): Promise<void> => {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        try {
          await authApi.logout({ refreshToken });
        } catch (error) {
          console.error('Logout error:', error);
        }
      }
      await clearTokens();
    },
  });
}


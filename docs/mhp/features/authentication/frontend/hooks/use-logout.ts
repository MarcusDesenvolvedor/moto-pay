import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { getRefreshToken } from '../../../../../../shared/storage/token-storage';
import { useAuthStore } from '../store/auth.store';

export function useLogout() {
  const clearAuth = useAuthStore((state) => state.clearAuth);

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
      // clearAuth already clears tokens from secure storage
      await clearAuth();
    },
  });
}

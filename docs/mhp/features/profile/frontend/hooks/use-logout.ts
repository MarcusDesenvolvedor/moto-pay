import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../../../authentication/frontend/api/auth.api';
import { getRefreshToken } from '../../../../../../shared/storage/token-storage';
import { useAuthStore } from '../../../authentication/frontend/store/auth.store';

export function useLogout() {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: async (): Promise<void> => {
      try {
        const refreshToken = await getRefreshToken();
        if (refreshToken) {
          await authApi.logout({ refreshToken });
        }
      } catch (error) {
        // Even if API call fails, clear local tokens
        console.error('Logout API error:', error);
      } finally {
        // Clear auth store (which clears tokens)
        await clearAuth();
        // Clear React Query cache
        queryClient.clear();
      }
    },
  });
}


import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { UserResponse } from '../types/auth.types';
import { useAuthStore } from '../store/auth.store';

export function useCurrentUser() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async (): Promise<UserResponse> => {
      const response = await authApi.getCurrentUser();
      return response.data;
    },
    enabled: isAuthenticated,
    retry: false,
  });
}

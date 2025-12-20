import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { UserResponse } from '../types/auth.types';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async (): Promise<UserResponse> => {
      const response = await authApi.getCurrentUser();
      return response.data;
    },
    retry: false,
  });
}


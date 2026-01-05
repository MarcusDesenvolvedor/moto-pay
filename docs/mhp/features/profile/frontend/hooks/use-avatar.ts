import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../../../authentication/frontend/api/auth.api';

// Load avatar from user profile (backend)
const loadAvatarFromProfile = async (): Promise<string | null> => {
  try {
    const response = await authApi.getCurrentUser();
    return response.data.avatarUrl || null;
  } catch (error) {
    console.error('Error loading avatar from profile:', error);
    return null;
  }
};

export function useAvatar() {
  const queryClient = useQueryClient();

  // Use React Query to cache and share avatar state from backend
  const {
    data: avatarUri,
    isLoading,
    refetch,
  } = useQuery<string | null>({
    queryKey: ['avatar', 'currentUser'],
    queryFn: loadAvatarFromProfile,
    staleTime: 0, // Always refetch to get latest from backend
  });

  return {
    avatarUri: avatarUri || null,
    isLoading,
    refetch,
  };
}


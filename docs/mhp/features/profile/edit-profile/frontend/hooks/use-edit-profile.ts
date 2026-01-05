import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { editProfileApi } from '../api/edit-profile.api';
import { UpdateProfileRequest, UpdatePasswordRequest, UserProfile } from '../types/edit-profile.types';
import { ApiResponse } from '../../../../authentication/frontend/types/auth.types';

export function useEditProfile() {
  const queryClient = useQueryClient();

  // Fetch current user profile
  const {
    data: profileResponse,
    isLoading,
    error,
  } = useQuery<ApiResponse<UserProfile>>({
    queryKey: ['profile'],
    queryFn: () => editProfileApi.getCurrentUser(),
  });

  // Update profile mutation
  const updateMutation = useMutation<
    ApiResponse<UserProfile>,
    Error,
    UpdateProfileRequest
  >({
    mutationFn: (data) => editProfileApi.updateProfile(data),
    onSuccess: () => {
      // Invalidate profile queries to refetch updated profile
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  // Update password mutation
  const updatePasswordMutation = useMutation<
    ApiResponse<{ message: string }>,
    Error,
    UpdatePasswordRequest
  >({
    mutationFn: (data) => editProfileApi.updatePassword(data),
  });

  // Upload avatar mutation
  const uploadAvatarMutation = useMutation<
    ApiResponse<UserProfile>,
    Error,
    string
  >({
    mutationFn: (imageBase64) => editProfileApi.uploadAvatar(imageBase64),
    onSuccess: () => {
      // Invalidate profile queries to refetch updated profile
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['avatar', 'currentUser'] });
    },
  });

  return {
    profile: profileResponse?.data,
    isLoading,
    error,
    updateProfile: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    updatePassword: updatePasswordMutation.mutateAsync,
    isUpdatingPassword: updatePasswordMutation.isPending,
    updatePasswordError: updatePasswordMutation.error,
    uploadAvatar: uploadAvatarMutation.mutateAsync,
    isUploadingAvatar: uploadAvatarMutation.isPending,
    uploadAvatarError: uploadAvatarMutation.error,
  };
}


import { useMutation, useQueryClient } from '@tanstack/react-query';
import { securityApi } from '../api/security.api';
import { ChangePasswordRequest } from '../types/security.types';

export function useChangePassword() {
  const queryClient = useQueryClient();

  return useMutation<
    { message: string },
    Error,
    ChangePasswordRequest
  >({
    mutationFn: (data: ChangePasswordRequest) =>
      securityApi.changePassword(data).then((res) => res.data),
    onSuccess: () => {
      // Invalidate user queries
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
}








import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { securityApi } from '../api/security.api';
import { Session } from '../types/security.types';

export function useSessions() {
  return useQuery<Session[]>({
    queryKey: ['sessions'],
    queryFn: () => securityApi.getSessions().then((res) => res.data),
  });
}

export function useLogoutSession() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: (sessionId: string) =>
      securityApi.logoutSession(sessionId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

export function useLogoutAllSessions() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, void>({
    mutationFn: () =>
      securityApi.logoutAllSessions().then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}








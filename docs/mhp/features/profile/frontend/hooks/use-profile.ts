import { useCurrentUser } from '../../../authentication/frontend/hooks/use-current-user';

export function useProfile() {
  return useCurrentUser();
}


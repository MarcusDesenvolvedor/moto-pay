import { useQuery } from '@tanstack/react-query';
import { companiesApi, Company } from '../api/companies.api';
import { useAuthStore } from '../../docs/mhp/features/authentication/frontend/store/auth.store';

export function useCompanies() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<Company[]>({
    queryKey: ['companies'],
    queryFn: () => companiesApi.getCompanies(),
    enabled: isAuthenticated,
    retry: false,
  });
}

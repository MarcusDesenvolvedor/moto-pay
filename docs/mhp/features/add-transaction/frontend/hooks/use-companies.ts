import { useQuery } from '@tanstack/react-query';
import { transactionsApi } from '../api/transactions.api';
import { Company } from '../types/transaction.types';
import { useAuthStore } from '../../../authentication/frontend/store/auth.store';

export function useCompanies() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ['companies'],
    queryFn: async (): Promise<Company[]> => {
      const response = await transactionsApi.getCompanies();
      return response.data;
    },
    enabled: isAuthenticated,
    retry: false,
  });
}


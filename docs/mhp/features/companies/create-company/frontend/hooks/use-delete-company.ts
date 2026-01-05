import { useMutation, useQueryClient } from '@tanstack/react-query';
import { companiesApi } from '../api/companies.api';

export function useDeleteCompany() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: (companyId: string) => companiesApi.deleteCompany(companyId),
    onSuccess: () => {
      // Invalidate companies queries to refetch updated list
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      // Also invalidate companies used in transactions
      queryClient.invalidateQueries({ queryKey: ['userCompanies'] });
    },
  });
}



import { useMutation, useQueryClient } from '@tanstack/react-query';
import { companiesApi } from '../api/companies.api';
import { CreateCompanyRequest, Company, ApiResponse } from '../types/company.types';

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Company>, Error, CreateCompanyRequest>({
    mutationFn: (data) => companiesApi.createCompany(data),
    onSuccess: () => {
      // Invalidate companies queries to refetch updated list
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      // Also invalidate companies used in transactions
      queryClient.invalidateQueries({ queryKey: ['userCompanies'] });
    },
  });
}


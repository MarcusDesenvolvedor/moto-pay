import { useQuery } from '@tanstack/react-query';
import { companiesApi } from '../api/companies.api';
import { Company, ApiResponse } from '../types/company.types';

export function useCompanies() {
  return useQuery<Company[]>({
    queryKey: ['companies'],
    queryFn: async (): Promise<Company[]> => {
      const response = await companiesApi.getCompanies();
      return response.data;
    },
  });
}











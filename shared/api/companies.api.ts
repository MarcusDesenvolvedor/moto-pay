import { apiClient } from './api-client';

export interface Company {
  id: string;
  name: string;
  document?: string;
}

interface ApiResponse<T> {
  data: T;
}

export const companiesApi = {
  getCompanies: async (): Promise<Company[]> => {
    const response = await apiClient.instance.get<ApiResponse<Company[]>>(
      '/transactions/companies',
    );
    return response.data.data;
  },
};

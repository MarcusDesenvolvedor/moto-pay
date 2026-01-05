import { apiClient } from '../../../../../../../shared/api/api-client';
import {
  CreateCompanyRequest,
  Company,
  ApiResponse,
} from '../types/company.types';

export const companiesApi = {
  createCompany: async (
    data: CreateCompanyRequest,
  ): Promise<ApiResponse<Company>> => {
    const response = await apiClient.instance.post<ApiResponse<Company>>(
      '/companies',
      data,
    );
    return response.data;
  },

  getCompanies: async (): Promise<ApiResponse<Company[]>> => {
    const response = await apiClient.instance.get<ApiResponse<Company[]>>(
      '/companies',
    );
    return response.data;
  },

  deleteCompany: async (companyId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.instance.delete<ApiResponse<{ message: string }>>(
      `/companies/${companyId}`,
    );
    return response.data;
  },
};


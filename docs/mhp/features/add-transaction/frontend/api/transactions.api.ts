import { apiClient } from '../../../../../../shared/api/api-client';
import {
  CreateTransactionRequest,
  Transaction,
  Company,
  ApiResponse,
} from '../types/transaction.types';

export const transactionsApi = {
  createTransaction: async (
    data: CreateTransactionRequest,
  ): Promise<ApiResponse<Transaction>> => {
    const response = await apiClient.instance.post<ApiResponse<Transaction>>(
      '/transactions',
      data,
    );
    return response.data;
  },

  getCompanies: async (): Promise<ApiResponse<Company[]>> => {
    const response = await apiClient.instance.get<ApiResponse<Company[]>>(
      '/transactions/companies',
    );
    return response.data;
  },
};


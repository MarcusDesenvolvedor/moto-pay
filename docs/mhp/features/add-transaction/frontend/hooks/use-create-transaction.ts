import { useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '../api/transactions.api';
import { CreateTransactionRequest, Transaction } from '../types/transaction.types';

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTransactionRequest): Promise<Transaction> => {
      const response = await transactionsApi.createTransaction(data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate reports queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}


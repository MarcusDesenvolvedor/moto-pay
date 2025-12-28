export enum TransactionType {
  GAIN = 'GAIN',
  EXPENSE = 'EXPENSE',
}

export interface Company {
  id: string;
  name: string;
  document?: string;
}

export interface CreateTransactionRequest {
  type: TransactionType;
  companyId: string;
  amount: number;
  paid: boolean;
  recordDate?: string;
  note?: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  companyId: string;
  amount: number;
  paid: boolean;
  note?: string;
  recordDate: string;
  status: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
}


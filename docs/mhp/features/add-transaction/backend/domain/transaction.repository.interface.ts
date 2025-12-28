import { Transaction } from './transaction.entity';

export interface ITransactionRepository {
  save(transaction: Transaction): Promise<Transaction>;
}


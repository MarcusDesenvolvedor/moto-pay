import { randomUUID } from 'crypto';

export enum TransactionType {
  GAIN = 'GAIN',
  EXPENSE = 'EXPENSE',
}

export class Transaction {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly type: TransactionType,
    public readonly amount: number,
    public readonly paid: boolean,
    public readonly note: string | null,
    public readonly recordDate: Date,
    public readonly status: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(
    companyId: string,
    type: TransactionType,
    amount: number,
    paid: boolean,
    note?: string,
    recordDate?: string | Date,
  ): Transaction {
    const now = new Date();
    let transactionRecordDate: Date;
    
    if (recordDate) {
      if (typeof recordDate === 'string') {
        transactionRecordDate = new Date(recordDate);
      } else {
        transactionRecordDate = recordDate;
      }
      transactionRecordDate.setHours(0, 0, 0, 0);
    } else {
      transactionRecordDate = new Date();
      transactionRecordDate.setHours(0, 0, 0, 0);
    }

    return new Transaction(
      randomUUID(),
      companyId,
      type,
      amount,
      paid,
      note || null,
      transactionRecordDate,
      'ACTIVE',
      now,
      now,
    );
  }

  isActive(): boolean {
    return this.status === 'ACTIVE';
  }
}


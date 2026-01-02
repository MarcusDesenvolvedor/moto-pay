import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Transaction, TransactionType } from '../../domain/transaction.entity';
import { ITransactionRepository } from '../../domain/transaction.repository.interface';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(transaction: Transaction): Promise<Transaction> {
    try {
      // Map Transaction type to FinancialRecord type
      const financialRecordType = transaction.type === TransactionType.GAIN ? 'income' : 'expense';
      
      // Default category based on type
      const category = transaction.type === TransactionType.GAIN ? 'General Income' : 'General Expense';

      // Ensure recordDate is a Date object
      const recordDate = transaction.recordDate instanceof Date 
        ? transaction.recordDate 
        : new Date(transaction.recordDate);

      const saved = await this.prisma.financialRecord.create({
        data: {
          id: transaction.id,
          companyId: transaction.companyId,
          vehicleId: transaction.vehicleId,
          type: financialRecordType,
          category: category,
          amount: transaction.amount,
          description: transaction.note,
          paid: transaction.paid,
          recordDate: recordDate,
          status: transaction.status,
          createdAt: transaction.createdAt,
          updatedAt: transaction.updatedAt,
        },
      });

      return this.toDomain(saved);
    } catch (error) {
      console.error('Error saving transaction:', error);
      throw error;
    }
  }

  private toDomain(prismaRecord: {
    id: string;
    companyId: string;
    vehicleId: string | null;
    type: string;
    amount: any; // Decimal from Prisma
    description: string | null;
    paid: boolean;
    recordDate: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }): Transaction {
    // Map FinancialRecord type back to Transaction type
    const transactionType = prismaRecord.type === 'income' ? TransactionType.GAIN : TransactionType.EXPENSE;

    return new Transaction(
      prismaRecord.id,
      prismaRecord.companyId,
      transactionType,
      Number(prismaRecord.amount),
      prismaRecord.paid,
      prismaRecord.description,
      prismaRecord.recordDate,
      prismaRecord.status,
      prismaRecord.vehicleId,
      prismaRecord.createdAt,
      prismaRecord.updatedAt,
    );
  }
}


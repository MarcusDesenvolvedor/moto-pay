import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Transaction } from '../../domain/transaction.entity';
import { ITransactionRepository } from '../../domain/transaction.repository.interface';
export declare class TransactionRepository implements ITransactionRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    save(transaction: Transaction): Promise<Transaction>;
    private toDomain;
}

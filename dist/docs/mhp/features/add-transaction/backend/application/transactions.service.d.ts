import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { ITransactionRepository } from '../domain/transaction.repository.interface';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionResponseDto } from '../dto/transaction-response.dto';
import { CompanyResponseDto } from '../dto/company-response.dto';
export declare class TransactionsService {
    private readonly transactionRepository;
    private readonly prisma;
    constructor(transactionRepository: ITransactionRepository, prisma: PrismaService);
    createTransaction(userId: string, createTransactionDto: CreateTransactionDto): Promise<TransactionResponseDto>;
    getUserCompanies(userId: string): Promise<CompanyResponseDto[]>;
    private toResponseDto;
}

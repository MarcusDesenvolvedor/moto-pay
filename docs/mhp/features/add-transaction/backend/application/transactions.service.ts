import {
  Injectable,
  Inject,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Transaction, TransactionType } from '../domain/transaction.entity';
import { ITransactionRepository } from '../domain/transaction.repository.interface';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionResponseDto } from '../dto/transaction-response.dto';
import { CompanyResponseDto } from '../dto/company-response.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
    private readonly prisma: PrismaService,
  ) {}

  async createTransaction(
    userId: string,
    createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    try {
      const company = await this.prisma.company.findFirst({
        where: {
          id: createTransactionDto.companyId,
          userId,
          deletedAt: null,
        },
      });

      if (!company) {
        throw new NotFoundException('Company not found');
      }

      const vehicle = await this.prisma.vehicle.findFirst({
        where: {
          id: createTransactionDto.vehicleId,
          userId,
          deletedAt: null,
        },
      });

      if (!vehicle) {
        throw new NotFoundException('Vehicle not found');
      }

      const transaction = Transaction.create(
        createTransactionDto.companyId,
        createTransactionDto.type,
        createTransactionDto.amount,
        createTransactionDto.paid,
        createTransactionDto.vehicleId,
        createTransactionDto.note,
        createTransactionDto.recordDate,
      );

      const savedTransaction = await this.transactionRepository.save(transaction);

      return this.toResponseDto(savedTransaction);
    } catch (error) {
      console.error('Error creating transaction:', error);
      if (error instanceof ForbiddenException || error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to create transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUserCompanies(userId: string): Promise<CompanyResponseDto[]> {
    const companies = await this.prisma.company.findMany({
      where: {
        userId,
        deletedAt: null,
      },
    });

    return companies.map((c) => ({
      id: c.id,
      name: c.name,
      document: c.document || undefined,
    }));
  }

  private toResponseDto(transaction: Transaction): TransactionResponseDto {
    return {
      id: transaction.id,
      type: transaction.type,
      companyId: transaction.companyId,
      amount: transaction.amount,
      paid: transaction.paid,
      note: transaction.note || undefined,
      recordDate: transaction.recordDate,
      status: transaction.status,
      vehicleId: transaction.vehicleId || undefined,
      createdAt: transaction.createdAt,
    };
  }
}


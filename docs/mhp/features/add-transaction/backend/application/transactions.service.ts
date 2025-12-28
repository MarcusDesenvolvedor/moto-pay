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
      // Validate that user belongs to the company
      const companyUser = await this.prisma.companyUser.findFirst({
        where: {
          companyId: createTransactionDto.companyId,
          userId: userId,
        },
        include: {
          company: true,
        },
      });

      if (!companyUser) {
        throw new ForbiddenException(
          `User ${userId} does not belong to company ${createTransactionDto.companyId}`,
        );
      }

      // Check if company is deleted
      if (companyUser.company.deletedAt) {
        throw new NotFoundException('Company not found or deleted');
      }

      // Create transaction entity
      const transaction = Transaction.create(
        createTransactionDto.companyId,
        createTransactionDto.type,
        createTransactionDto.amount,
        createTransactionDto.paid,
        createTransactionDto.note,
        createTransactionDto.recordDate,
      );

      // Save transaction
      const savedTransaction = await this.transactionRepository.save(transaction);

      // Map to response DTO
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
    const companyUsers = await this.prisma.companyUser.findMany({
      where: {
        userId: userId,
        company: {
          deletedAt: null,
        },
      },
      include: {
        company: true,
      },
    });

    return companyUsers.map((cu) => ({
      id: cu.company.id,
      name: cu.company.name,
      document: cu.company.document || undefined,
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
      createdAt: transaction.createdAt,
    };
  }
}


import { Module } from '@nestjs/common';
import { TransactionsController } from './controllers/transactions.controller';
import { TransactionsService } from './application/transactions.service';
import { TransactionRepository } from './infrastructure/repositories/transaction.repository';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { AuthenticationModule } from '../../authentication/backend/authentication.module';

@Module({
  imports: [AuthenticationModule],
  controllers: [TransactionsController],
  providers: [
    TransactionsService,
    TransactionRepository,
    PrismaService,
    {
      provide: 'ITransactionRepository',
      useClass: TransactionRepository,
    },
  ],
  exports: [TransactionsService],
})
export class TransactionsModule {}


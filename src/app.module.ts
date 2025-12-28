import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from '../docs/mhp/features/authentication/backend/authentication.module';
import { TransactionsModule } from '../docs/mhp/features/add-transaction/backend/transactions.module';
import { ReportsModule } from '../docs/mhp/features/reports/backend/reports.module';
import { PrismaService } from '../shared/infrastructure/prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthenticationModule,
    TransactionsModule,
    ReportsModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}


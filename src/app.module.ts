import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from '../docs/mhp/features/authentication/backend/authentication.module';
import { TransactionsModule } from '../docs/mhp/features/add-transaction/backend/transactions.module';
import { ReportsModule } from '../docs/mhp/features/reports/backend/reports.module';
import { VehiclesModule } from '../docs/mhp/features/vehicles/backend/vehicles.module';
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
    VehiclesModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}


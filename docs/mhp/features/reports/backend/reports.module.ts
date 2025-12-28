import { Module } from '@nestjs/common';
import { ReportsController } from './controllers/reports.controller';
import { ReportsService } from './application/reports.service';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { AuthenticationModule } from '../../authentication/backend/authentication.module';

@Module({
  imports: [AuthenticationModule],
  controllers: [ReportsController],
  providers: [ReportsService, PrismaService],
  exports: [ReportsService],
})
export class ReportsModule {}


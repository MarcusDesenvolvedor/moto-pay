import { Module } from '@nestjs/common';
import { CompaniesController } from './controllers/companies.controller';
import { CompaniesService } from './application/companies.service';
import { CompanyRepository } from './infrastructure/repositories/company.repository';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';

@Module({
  controllers: [CompaniesController],
  providers: [
    CompaniesService,
    {
      provide: 'ICompanyRepository',
      useClass: CompanyRepository,
    },
    PrismaService,
  ],
  exports: [CompaniesService],
})
export class CompaniesModule {}


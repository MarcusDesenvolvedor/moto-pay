import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Company } from '../../domain/company.entity';
import { ICompanyRepository } from '../../domain/company.repository.interface';

@Injectable()
export class CompanyRepository implements ICompanyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(company: Company): Promise<Company> {
    const saved = await this.prisma.company.upsert({
      where: { id: company.id },
      create: {
        id: company.id,
        name: company.name,
        document: company.document,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
        deletedAt: company.deletedAt,
      },
      update: {
        name: company.name,
        document: company.document,
        updatedAt: company.updatedAt,
        deletedAt: company.deletedAt,
      },
    });

    return this.toDomain(saved);
  }

  async findById(id: string): Promise<Company | null> {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!company) {
      return null;
    }

    return this.toDomain(company);
  }

  private toDomain(prismaCompany: {
    id: string;
    name: string;
    document: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }): Company {
    return new Company(
      prismaCompany.id,
      prismaCompany.name,
      prismaCompany.document,
      prismaCompany.createdAt,
      prismaCompany.updatedAt,
      prismaCompany.deletedAt,
    );
  }
}


import { Injectable, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Company } from '../domain/company.entity';
import { ICompanyRepository } from '../domain/company.repository.interface';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { CompanyResponseDto } from '../dto/company-response.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @Inject('ICompanyRepository')
    private readonly companyRepository: ICompanyRepository,
    private readonly prisma: PrismaService,
  ) {}

  async createCompany(
    userId: string,
    createCompanyDto: CreateCompanyDto,
  ): Promise<CompanyResponseDto> {
    try {
      const company = Company.create(
        userId,
        createCompanyDto.name,
        createCompanyDto.description || null,
      );

      const savedCompany = await this.companyRepository.save(company);

      return this.toResponseDto(savedCompany);
    } catch (error) {
      console.error('Error creating company:', error);
      throw new Error(
        `Failed to create company: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async getUserCompanies(userId: string): Promise<CompanyResponseDto[]> {
    try {
      const companies = await this.prisma.company.findMany({
        where: {
          userId,
          deletedAt: null,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return companies.map((c) => ({
        id: c.id,
        name: c.name,
        description: c.document || undefined,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      }));
    } catch (error) {
      console.error('Error getting user companies:', error);
      throw new Error(
        `Failed to get companies: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async deleteCompany(
    userId: string,
    companyId: string,
  ): Promise<{ message: string }> {
    try {
      const company = await this.companyRepository.findById(companyId);
      if (!company) {
        throw new NotFoundException('Company not found');
      }

      if (company.deletedAt) {
        throw new NotFoundException('Company already deleted');
      }

      if (company.userId !== userId) {
        throw new ForbiddenException(
          'You do not have permission to delete this company',
        );
      }

      const deletedCompany = company.delete();
      await this.companyRepository.save(deletedCompany);

      return { message: 'Company deleted successfully' };
    } catch (error) {
      console.error('Error deleting company:', error);
      if (error instanceof ForbiddenException || error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Failed to delete company: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  private toResponseDto(company: Company): CompanyResponseDto {
    return {
      id: company.id,
      name: company.name,
      description: company.document || undefined,
      createdAt: company.createdAt.toISOString(),
      updatedAt: company.updatedAt.toISOString(),
    };
  }
}


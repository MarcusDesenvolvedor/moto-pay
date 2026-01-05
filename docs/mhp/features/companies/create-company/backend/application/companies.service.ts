import { Injectable, Inject, ForbiddenException, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
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
      // Create company entity (using description as document field)
      const company = Company.create(
        createCompanyDto.name,
        createCompanyDto.description || null,
      );

      // Save company
      const savedCompany = await this.companyRepository.save(company);

      // Create company_users record with OWNER role
      await this.prisma.companyUser.create({
        data: {
          id: randomUUID(),
          companyId: savedCompany.id,
          userId: userId,
          role: 'OWNER',
          createdAt: new Date(),
        },
      });

      // Return response DTO
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
        orderBy: {
          createdAt: 'desc',
        },
      });

      return companyUsers.map((cu) => ({
        id: cu.company.id,
        name: cu.company.name,
        description: cu.company.document || undefined,
        createdAt: cu.company.createdAt.toISOString(),
        updatedAt: cu.company.updatedAt.toISOString(),
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
      // Verify user belongs to company and has OWNER role
      const companyUser = await this.prisma.companyUser.findFirst({
        where: {
          companyId: companyId,
          userId: userId,
          role: 'OWNER',
        },
        include: {
          company: true,
        },
      });

      if (!companyUser) {
        throw new ForbiddenException(
          'You do not have permission to delete this company',
        );
      }

      // Get company entity
      const company = await this.companyRepository.findById(companyId);
      if (!company) {
        throw new NotFoundException('Company not found');
      }

      if (company.deletedAt) {
        throw new NotFoundException('Company already deleted');
      }

      // Soft delete company
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


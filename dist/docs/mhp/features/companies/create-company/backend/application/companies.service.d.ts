import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { ICompanyRepository } from '../domain/company.repository.interface';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { CompanyResponseDto } from '../dto/company-response.dto';
export declare class CompaniesService {
    private readonly companyRepository;
    private readonly prisma;
    constructor(companyRepository: ICompanyRepository, prisma: PrismaService);
    createCompany(userId: string, createCompanyDto: CreateCompanyDto): Promise<CompanyResponseDto>;
    getUserCompanies(userId: string): Promise<CompanyResponseDto[]>;
    deleteCompany(userId: string, companyId: string): Promise<{
        message: string;
    }>;
    private toResponseDto;
}

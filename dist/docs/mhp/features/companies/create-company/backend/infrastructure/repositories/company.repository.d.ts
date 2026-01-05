import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Company } from '../../domain/company.entity';
import { ICompanyRepository } from '../../domain/company.repository.interface';
export declare class CompanyRepository implements ICompanyRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    save(company: Company): Promise<Company>;
    findById(id: string): Promise<Company | null>;
    private toDomain;
}

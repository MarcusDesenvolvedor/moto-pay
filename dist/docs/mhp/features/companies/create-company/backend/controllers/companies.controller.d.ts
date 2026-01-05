import { CompaniesService } from '../application/companies.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { CompanyResponseDto } from '../dto/company-response.dto';
import { CurrentUserPayload } from '../../../../authentication/backend/decorators/current-user.decorator';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    createCompany(user: CurrentUserPayload, createCompanyDto: CreateCompanyDto): Promise<{
        data: CompanyResponseDto;
    }>;
    getUserCompanies(user: CurrentUserPayload): Promise<{
        data: CompanyResponseDto[];
    }>;
    deleteCompany(user: CurrentUserPayload, companyId: string): Promise<{
        data: {
            message: string;
        };
    }>;
}

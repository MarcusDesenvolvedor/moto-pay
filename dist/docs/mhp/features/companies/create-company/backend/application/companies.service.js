"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../../../../../../shared/infrastructure/prisma/prisma.service");
const company_entity_1 = require("../domain/company.entity");
let CompaniesService = class CompaniesService {
    constructor(companyRepository, prisma) {
        this.companyRepository = companyRepository;
        this.prisma = prisma;
    }
    async createCompany(userId, createCompanyDto) {
        try {
            const company = company_entity_1.Company.create(createCompanyDto.name, createCompanyDto.description || null);
            const savedCompany = await this.companyRepository.save(company);
            await this.prisma.companyUser.create({
                data: {
                    id: (0, crypto_1.randomUUID)(),
                    companyId: savedCompany.id,
                    userId: userId,
                    role: 'OWNER',
                    createdAt: new Date(),
                },
            });
            return this.toResponseDto(savedCompany);
        }
        catch (error) {
            console.error('Error creating company:', error);
            throw new Error(`Failed to create company: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getUserCompanies(userId) {
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
        }
        catch (error) {
            console.error('Error getting user companies:', error);
            throw new Error(`Failed to get companies: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async deleteCompany(userId, companyId) {
        try {
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
                throw new common_1.ForbiddenException('You do not have permission to delete this company');
            }
            const company = await this.companyRepository.findById(companyId);
            if (!company) {
                throw new common_1.NotFoundException('Company not found');
            }
            if (company.deletedAt) {
                throw new common_1.NotFoundException('Company already deleted');
            }
            const deletedCompany = company.delete();
            await this.companyRepository.save(deletedCompany);
            return { message: 'Company deleted successfully' };
        }
        catch (error) {
            console.error('Error deleting company:', error);
            if (error instanceof common_1.ForbiddenException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to delete company: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    toResponseDto(company) {
        return {
            id: company.id,
            name: company.name,
            description: company.document || undefined,
            createdAt: company.createdAt.toISOString(),
            updatedAt: company.updatedAt.toISOString(),
        };
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ICompanyRepository')),
    __metadata("design:paramtypes", [Object, prisma_service_1.PrismaService])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../../../../shared/infrastructure/prisma/prisma.service");
const company_entity_1 = require("../../domain/company.entity");
let CompanyRepository = class CompanyRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async save(company) {
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
    async findById(id) {
        const company = await this.prisma.company.findUnique({
            where: { id },
        });
        if (!company) {
            return null;
        }
        return this.toDomain(company);
    }
    toDomain(prismaCompany) {
        return new company_entity_1.Company(prismaCompany.id, prismaCompany.name, prismaCompany.document, prismaCompany.createdAt, prismaCompany.updatedAt, prismaCompany.deletedAt);
    }
};
exports.CompanyRepository = CompanyRepository;
exports.CompanyRepository = CompanyRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompanyRepository);
//# sourceMappingURL=company.repository.js.map
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
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../../shared/infrastructure/prisma/prisma.service");
const transaction_entity_1 = require("../domain/transaction.entity");
let TransactionsService = class TransactionsService {
    constructor(transactionRepository, prisma) {
        this.transactionRepository = transactionRepository;
        this.prisma = prisma;
    }
    async createTransaction(userId, createTransactionDto) {
        try {
            const companyUser = await this.prisma.companyUser.findFirst({
                where: {
                    companyId: createTransactionDto.companyId,
                    userId: userId,
                },
                include: {
                    company: true,
                },
            });
            if (!companyUser) {
                throw new common_1.ForbiddenException(`User ${userId} does not belong to company ${createTransactionDto.companyId}`);
            }
            if (companyUser.company.deletedAt) {
                throw new common_1.NotFoundException('Company not found or deleted');
            }
            const vehicle = await this.prisma.vehicle.findFirst({
                where: {
                    id: createTransactionDto.vehicleId,
                    companyId: createTransactionDto.companyId,
                    deletedAt: null,
                },
            });
            if (!vehicle) {
                throw new common_1.NotFoundException(`Vehicle ${createTransactionDto.vehicleId} not found or does not belong to company`);
            }
            const transaction = transaction_entity_1.Transaction.create(createTransactionDto.companyId, createTransactionDto.type, createTransactionDto.amount, createTransactionDto.paid, createTransactionDto.vehicleId, createTransactionDto.note, createTransactionDto.recordDate);
            const savedTransaction = await this.transactionRepository.save(transaction);
            return this.toResponseDto(savedTransaction);
        }
        catch (error) {
            console.error('Error creating transaction:', error);
            if (error instanceof common_1.ForbiddenException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to create transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getUserCompanies(userId) {
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
        });
        return companyUsers.map((cu) => ({
            id: cu.company.id,
            name: cu.company.name,
            document: cu.company.document || undefined,
        }));
    }
    toResponseDto(transaction) {
        return {
            id: transaction.id,
            type: transaction.type,
            companyId: transaction.companyId,
            amount: transaction.amount,
            paid: transaction.paid,
            note: transaction.note || undefined,
            recordDate: transaction.recordDate,
            status: transaction.status,
            vehicleId: transaction.vehicleId || undefined,
            createdAt: transaction.createdAt,
        };
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ITransactionRepository')),
    __metadata("design:paramtypes", [Object, prisma_service_1.PrismaService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map
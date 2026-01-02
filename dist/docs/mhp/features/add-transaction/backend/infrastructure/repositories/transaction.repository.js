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
exports.TransactionRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../../../shared/infrastructure/prisma/prisma.service");
const transaction_entity_1 = require("../../domain/transaction.entity");
let TransactionRepository = class TransactionRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async save(transaction) {
        try {
            const financialRecordType = transaction.type === transaction_entity_1.TransactionType.GAIN ? 'income' : 'expense';
            const category = transaction.type === transaction_entity_1.TransactionType.GAIN ? 'General Income' : 'General Expense';
            const recordDate = transaction.recordDate instanceof Date
                ? transaction.recordDate
                : new Date(transaction.recordDate);
            const saved = await this.prisma.financialRecord.create({
                data: {
                    id: transaction.id,
                    companyId: transaction.companyId,
                    vehicleId: transaction.vehicleId,
                    type: financialRecordType,
                    category: category,
                    amount: transaction.amount,
                    description: transaction.note,
                    paid: transaction.paid,
                    recordDate: recordDate,
                    status: transaction.status,
                    createdAt: transaction.createdAt,
                    updatedAt: transaction.updatedAt,
                },
            });
            return this.toDomain(saved);
        }
        catch (error) {
            console.error('Error saving transaction:', error);
            throw error;
        }
    }
    toDomain(prismaRecord) {
        const transactionType = prismaRecord.type === 'income' ? transaction_entity_1.TransactionType.GAIN : transaction_entity_1.TransactionType.EXPENSE;
        return new transaction_entity_1.Transaction(prismaRecord.id, prismaRecord.companyId, transactionType, Number(prismaRecord.amount), prismaRecord.paid, prismaRecord.description, prismaRecord.recordDate, prismaRecord.status, prismaRecord.vehicleId, prismaRecord.createdAt, prismaRecord.updatedAt);
    }
};
exports.TransactionRepository = TransactionRepository;
exports.TransactionRepository = TransactionRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionRepository);
//# sourceMappingURL=transaction.repository.js.map
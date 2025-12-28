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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../../shared/infrastructure/prisma/prisma.service");
let ReportsService = class ReportsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDailySummary(userId) {
        try {
            const companyUsers = await this.prisma.companyUser.findMany({
                where: {
                    userId: userId,
                    company: {
                        deletedAt: null,
                    },
                },
                select: {
                    companyId: true,
                },
            });
            const companyIds = companyUsers.map((cu) => cu.companyId);
            if (companyIds.length === 0) {
                return {
                    income: 0,
                    expense: 0,
                };
            }
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const transactions = await this.prisma.financialRecord.findMany({
                where: {
                    companyId: {
                        in: companyIds,
                    },
                    recordDate: {
                        gte: today,
                        lt: tomorrow,
                    },
                    status: 'ACTIVE',
                    deletedAt: null,
                },
                select: {
                    type: true,
                    amount: true,
                },
            });
            let income = 0;
            let expense = 0;
            for (const transaction of transactions) {
                const amount = Number(transaction.amount);
                if (transaction.type === 'income') {
                    income += amount;
                }
                else if (transaction.type === 'expense') {
                    expense += amount;
                }
            }
            return {
                income,
                expense,
            };
        }
        catch (error) {
            console.error('Error getting daily summary:', error);
            return {
                income: 0,
                expense: 0,
            };
        }
    }
    async getReportsSummary(userId, startDate, endDate) {
        const companyUsers = await this.prisma.companyUser.findMany({
            where: {
                userId: userId,
                company: {
                    deletedAt: null,
                },
            },
            select: {
                companyId: true,
            },
        });
        const companyIds = companyUsers.map((cu) => cu.companyId);
        if (companyIds.length === 0) {
            return {
                data: [],
            };
        }
        const dateFilter = {};
        if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            dateFilter.gte = start;
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            dateFilter.lte = end;
        }
        const transactions = await this.prisma.financialRecord.findMany({
            where: {
                companyId: {
                    in: companyIds,
                },
                ...(Object.keys(dateFilter).length > 0 && { recordDate: dateFilter }),
                status: 'ACTIVE',
                deletedAt: null,
            },
            select: {
                recordDate: true,
                type: true,
                amount: true,
            },
            orderBy: {
                recordDate: 'asc',
            },
        });
        const summaryByDate = new Map();
        for (const transaction of transactions) {
            const dateKey = transaction.recordDate.toISOString().split('T')[0];
            const amount = Number(transaction.amount);
            if (!summaryByDate.has(dateKey)) {
                summaryByDate.set(dateKey, { income: 0, expense: 0 });
            }
            const summary = summaryByDate.get(dateKey);
            if (transaction.type === 'income') {
                summary.income += amount;
            }
            else if (transaction.type === 'expense') {
                summary.expense += amount;
            }
        }
        const data = Array.from(summaryByDate.entries())
            .map(([date, summary]) => ({
            date,
            income: summary.income,
            expense: summary.expense,
        }))
            .sort((a, b) => a.date.localeCompare(b.date));
        return {
            data,
        };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map
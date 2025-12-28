import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { DailySummaryResponseDto } from '../dto/daily-summary-response.dto';
import { ReportsSummaryResponseDto, ReportsSummaryItemDto } from '../dto/reports-summary-response.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDailySummary(userId: string): Promise<DailySummaryResponseDto> {
    try {
      // Get all companies the user belongs to
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

      // Get today's date (only date part, no time)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Get all transactions from today for user's companies
      // Buscar da tabela financial_records (transactions)
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

      // Sum income (GAIN) and expenses (EXPENSE)
      // type 'income' = GAIN, type 'expense' = EXPENSE
      let income = 0;
      let expense = 0;

      for (const transaction of transactions) {
        const amount = Number(transaction.amount);
        if (transaction.type === 'income') {
          // GAIN - soma em income
          income += amount;
        } else if (transaction.type === 'expense') {
          // EXPENSE - soma em expense
          expense += amount;
        }
      }

      return {
        income,
        expense,
      };
    } catch (error) {
      console.error('Error getting daily summary:', error);
      return {
        income: 0,
        expense: 0,
      };
    }
  }

  async getReportsSummary(
    userId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<ReportsSummaryResponseDto> {
    // Get all companies the user belongs to
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

    // Build date filter
    const dateFilter: any = {};
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

    // Get all transactions for user's companies
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

    // Group by date and sum
    const summaryByDate = new Map<string, { income: number; expense: number }>();

    for (const transaction of transactions) {
      const dateKey = transaction.recordDate.toISOString().split('T')[0];
      const amount = Number(transaction.amount);

      if (!summaryByDate.has(dateKey)) {
        summaryByDate.set(dateKey, { income: 0, expense: 0 });
      }

      const summary = summaryByDate.get(dateKey)!;
      // type 'income' = GAIN, type 'expense' = EXPENSE
      if (transaction.type === 'income') {
        // GAIN - soma em income
        summary.income += amount;
      } else if (transaction.type === 'expense') {
        // EXPENSE - soma em expense
        summary.expense += amount;
      }
    }

    // Convert to array and sort by date
    const data: ReportsSummaryItemDto[] = Array.from(summaryByDate.entries())
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
}


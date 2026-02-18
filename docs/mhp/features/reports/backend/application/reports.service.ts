import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { DailySummaryResponseDto } from '../dto/daily-summary-response.dto';
import {
  ReportsSummaryResponseDto,
  ReportsSummaryItemDto,
} from '../dto/reports-summary-response.dto';
import {
  ReportsByCategoryResponseDto,
  ReportsByCategoryItemDto,
} from '../dto/reports-by-category-response.dto';
import {
  ReportsByVehicleResponseDto,
  ReportsByVehicleItemDto,
} from '../dto/reports-by-vehicle-response.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Resolves the companyId to use for reports. If the provided companyId is not
   * valid for the user (e.g. stale cache), falls back to the first company the
   * user belongs to.
   */
  private async resolveCompanyId(
    userId: string,
    companyId: string,
  ): Promise<string> {
    const membership = await this.prisma.companyUser.findFirst({
      where: {
        userId,
        companyId,
        company: { deletedAt: null },
      },
    });
    if (membership) {
      return companyId;
    }
    // Fallback: use first company user belongs to (handles stale frontend cache)
    const firstMembership = await this.prisma.companyUser.findFirst({
      where: {
        userId,
        company: { deletedAt: null },
      },
      select: { companyId: true },
    });
    if (!firstMembership) {
      throw new ForbiddenException(
        `User does not belong to any company`,
      );
    }
    return firstMembership.companyId;
  }

  private buildDateFilter(startDate?: string, endDate?: string) {
    const filter: { gte?: Date; lte?: Date } = {};
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filter.gte = start;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter.lte = end;
    }
    return Object.keys(filter).length > 0 ? filter : undefined;
  }

  async getDailySummary(
    userId: string,
    companyId: string,
    dateStr?: string,
  ): Promise<DailySummaryResponseDto> {
    const resolvedCompanyId = await this.resolveCompanyId(userId, companyId);

    // Use date from client (user's local "today") to avoid timezone mismatch.
    let targetDate: string;
    if (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      targetDate = dateStr;
    } else {
      const today = new Date();
      targetDate = today.toISOString().slice(0, 10);
    }

    // Build date range: start and end of target day in UTC to avoid timezone issues.
    const startOfDay = new Date(`${targetDate}T00:00:00.000Z`);
    const endOfDay = new Date(`${targetDate}T23:59:59.999Z`);

    const transactions = await this.prisma.financialRecord.findMany({
      where: {
        companyId: resolvedCompanyId,
        recordDate: { gte: startOfDay, lte: endOfDay },
        status: 'ACTIVE',
        deletedAt: null,
      },
      select: { type: true, amount: true },
    });

    let income = 0;
    let expense = 0;
    for (const t of transactions) {
      const amount = Number(t.amount);
      if (t.type === 'income') income += amount;
      else if (t.type === 'expense') expense += amount;
    }

    return { income, expense };
  }

  async getReportsSummary(
    userId: string,
    companyId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<ReportsSummaryResponseDto> {
    const resolvedCompanyId = await this.resolveCompanyId(userId, companyId);

    const dateFilter = this.buildDateFilter(startDate, endDate);

    const transactions = await this.prisma.financialRecord.findMany({
      where: {
        companyId: resolvedCompanyId,
        ...(dateFilter && { recordDate: dateFilter }),
        status: 'ACTIVE',
        deletedAt: null,
      },
      select: { recordDate: true, type: true, amount: true },
      orderBy: { recordDate: 'asc' },
    });

    const summaryByDate = new Map<string, { income: number; expense: number }>();
    for (const t of transactions) {
      const dateKey = t.recordDate.toISOString().split('T')[0];
      if (!summaryByDate.has(dateKey)) {
        summaryByDate.set(dateKey, { income: 0, expense: 0 });
      }
      const s = summaryByDate.get(dateKey)!;
      const amount = Number(t.amount);
      if (t.type === 'income') s.income += amount;
      else if (t.type === 'expense') s.expense += amount;
    }

    const data: ReportsSummaryItemDto[] = Array.from(summaryByDate.entries())
      .map(([date, s]) => ({ date, income: s.income, expense: s.expense }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return { data };
  }

  async getReportsByCategory(
    userId: string,
    companyId: string,
    startDate?: string,
    endDate?: string,
    vehicleId?: string,
  ): Promise<ReportsByCategoryResponseDto> {
    const resolvedCompanyId = await this.resolveCompanyId(userId, companyId);

    const dateFilter = this.buildDateFilter(startDate, endDate);

    const transactions = await this.prisma.financialRecord.findMany({
      where: {
        companyId: resolvedCompanyId,
        ...(dateFilter && { recordDate: dateFilter }),
        ...(vehicleId && { vehicleId }),
        status: 'ACTIVE',
        deletedAt: null,
      },
      select: { type: true, category: true, amount: true },
    });

    const byCategory = new Map<
      string,
      { income: number; expense: number }
    >();
    for (const t of transactions) {
      const cat = t.category || 'Outros';
      if (!byCategory.has(cat)) {
        byCategory.set(cat, { income: 0, expense: 0 });
      }
      const s = byCategory.get(cat)!;
      const amount = Number(t.amount);
      if (t.type === 'income') s.income += amount;
      else if (t.type === 'expense') s.expense += amount;
    }

    const data: ReportsByCategoryItemDto[] = Array.from(byCategory.entries())
      .map(([category, s]) => ({
        category,
        income: s.income,
        expense: s.expense,
        total: s.income + s.expense,
      }))
      .sort((a, b) => b.total - a.total);

    return { data };
  }

  async getReportsByVehicle(
    userId: string,
    companyId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<ReportsByVehicleResponseDto> {
    const resolvedCompanyId = await this.resolveCompanyId(userId, companyId);

    const dateFilter = this.buildDateFilter(startDate, endDate);

    const transactions = await this.prisma.financialRecord.findMany({
      where: {
        companyId: resolvedCompanyId,
        ...(dateFilter && { recordDate: dateFilter }),
        status: 'ACTIVE',
        deletedAt: null,
      },
      select: {
        vehicleId: true,
        type: true,
        amount: true,
        vehicle: { select: { name: true } },
      },
    });

    const byVehicle = new Map<
      string,
      { name: string; income: number; expense: number }
    >();

    for (const t of transactions) {
      const key = t.vehicleId ?? '__none__';
      const name = t.vehicle?.name ?? 'Sem veículo';
      if (!byVehicle.has(key)) {
        byVehicle.set(key, { name, income: 0, expense: 0 });
      }
      const s = byVehicle.get(key)!;
      const amount = Number(t.amount);
      if (t.type === 'income') s.income += amount;
      else if (t.type === 'expense') s.expense += amount;
    }

    const data: ReportsByVehicleItemDto[] = Array.from(byVehicle.entries())
      .map(([vehicleId, s]) => ({
        vehicleId: vehicleId === '__none__' ? null : vehicleId,
        vehicleName: s.name,
        income: s.income,
        expense: s.expense,
        profit: s.income - s.expense,
      }))
      .sort((a, b) => b.profit - a.profit);

    return { data };
  }
}


import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { DailySummaryResponseDto } from '../dto/daily-summary-response.dto';
import { ReportsSummaryResponseDto } from '../dto/reports-summary-response.dto';
export declare class ReportsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDailySummary(userId: string): Promise<DailySummaryResponseDto>;
    getReportsSummary(userId: string, startDate?: string, endDate?: string): Promise<ReportsSummaryResponseDto>;
}

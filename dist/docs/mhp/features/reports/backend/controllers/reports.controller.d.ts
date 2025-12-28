import { ReportsService } from '../application/reports.service';
import { DailySummaryResponseDto } from '../dto/daily-summary-response.dto';
import { ReportsSummaryResponseDto } from '../dto/reports-summary-response.dto';
import { CurrentUserPayload } from '../../../authentication/backend/decorators/current-user.decorator';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getDailySummary(user: CurrentUserPayload): Promise<{
        data: DailySummaryResponseDto;
    }>;
    getReportsSummary(user: CurrentUserPayload, startDate?: string, endDate?: string): Promise<{
        data: ReportsSummaryResponseDto;
    }>;
}

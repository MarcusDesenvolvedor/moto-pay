import {
  Controller,
  Get,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReportsService } from '../application/reports.service';
import { DailySummaryResponseDto } from '../dto/daily-summary-response.dto';
import { ReportsSummaryResponseDto } from '../dto/reports-summary-response.dto';
import { CurrentUser, CurrentUserPayload } from '../../../authentication/backend/decorators/current-user.decorator';

@Controller('reports')
@UseGuards(AuthGuard('jwt'))
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('daily-summary')
  @HttpCode(HttpStatus.OK)
  async getDailySummary(
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<{ data: DailySummaryResponseDto }> {
    const summary = await this.reportsService.getDailySummary(user.userId);
    return { data: summary };
  }

  @Get('summary')
  @HttpCode(HttpStatus.OK)
  async getReportsSummary(
    @CurrentUser() user: CurrentUserPayload,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<{ data: ReportsSummaryResponseDto }> {
    const summary = await this.reportsService.getReportsSummary(
      user.userId,
      startDate,
      endDate,
    );
    return { data: summary };
  }
}


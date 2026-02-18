import {
  Controller,
  Get,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReportsService } from '../application/reports.service';
import { DailySummaryResponseDto } from '../dto/daily-summary-response.dto';
import { ReportsSummaryResponseDto } from '../dto/reports-summary-response.dto';
import { ReportsByCategoryResponseDto } from '../dto/reports-by-category-response.dto';
import { ReportsByVehicleResponseDto } from '../dto/reports-by-vehicle-response.dto';
import { CurrentUser, CurrentUserPayload } from '../../../authentication/backend/decorators/current-user.decorator';

@Controller('reports')
@UseGuards(AuthGuard('jwt'))
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('daily-summary')
  @HttpCode(HttpStatus.OK)
  async getDailySummary(
    @CurrentUser() user: CurrentUserPayload,
    @Query('companyId') companyId?: string,
    @Query('date') date?: string,
  ): Promise<{ data: DailySummaryResponseDto }> {
    if (!companyId) {
      throw new BadRequestException('companyId is required');
    }
    const summary = await this.reportsService.getDailySummary(
      user.userId,
      companyId,
      date,
    );
    return { data: summary };
  }

  @Get('summary')
  @HttpCode(HttpStatus.OK)
  async getReportsSummary(
    @CurrentUser() user: CurrentUserPayload,
    @Query('companyId') companyId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<{ data: ReportsSummaryResponseDto }> {
    if (!companyId) {
      throw new BadRequestException('companyId is required');
    }
    const summary = await this.reportsService.getReportsSummary(
      user.userId,
      companyId,
      startDate,
      endDate,
    );
    return { data: summary };
  }

  @Get('by-category')
  @HttpCode(HttpStatus.OK)
  async getReportsByCategory(
    @CurrentUser() user: CurrentUserPayload,
    @Query('companyId') companyId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('vehicleId') vehicleId?: string,
  ): Promise<{ data: ReportsByCategoryResponseDto }> {
    if (!companyId) {
      throw new BadRequestException('companyId is required');
    }
    const summary = await this.reportsService.getReportsByCategory(
      user.userId,
      companyId,
      startDate,
      endDate,
      vehicleId,
    );
    return { data: summary };
  }

  @Get('by-vehicle')
  @HttpCode(HttpStatus.OK)
  async getReportsByVehicle(
    @CurrentUser() user: CurrentUserPayload,
    @Query('companyId') companyId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<{ data: ReportsByVehicleResponseDto }> {
    if (!companyId) {
      throw new BadRequestException('companyId is required');
    }
    const summary = await this.reportsService.getReportsByVehicle(
      user.userId,
      companyId,
      startDate,
      endDate,
    );
    return { data: summary };
  }
}


import { apiClient } from '../../../../../../shared/api/api-client';
import {
  DailySummaryResponse,
  ReportsSummaryResponse,
  ReportsByCategoryResponse,
  ReportsByVehicleResponse,
  ApiResponse,
} from '../types/reports.types';

export interface ReportsApiParams {
  companyId: string;
  startDate?: string;
  endDate?: string;
  vehicleId?: string;
}

export const reportsApi = {
  getDailySummary: async (
    companyId: string,
    date?: string,
  ): Promise<ApiResponse<DailySummaryResponse>> => {
    const params = new URLSearchParams({ companyId });
    if (date) params.append('date', date);
    const response = await apiClient.instance.get<
      ApiResponse<DailySummaryResponse>
    >(`/reports/daily-summary?${params.toString()}`);
    return response.data;
  },

  getReportsSummary: async ({
    companyId,
    startDate,
    endDate,
  }: ReportsApiParams): Promise<ApiResponse<ReportsSummaryResponse>> => {
    const params = new URLSearchParams({ companyId });
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await apiClient.instance.get<
      ApiResponse<ReportsSummaryResponse>
    >(`/reports/summary?${params.toString()}`);
    return response.data;
  },

  getReportsByCategory: async ({
    companyId,
    startDate,
    endDate,
    vehicleId,
  }: ReportsApiParams): Promise<ApiResponse<ReportsByCategoryResponse>> => {
    const params = new URLSearchParams({ companyId });
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (vehicleId) params.append('vehicleId', vehicleId);

    const response = await apiClient.instance.get<
      ApiResponse<ReportsByCategoryResponse>
    >(`/reports/by-category?${params.toString()}`);
    return response.data;
  },

  getReportsByVehicle: async ({
    companyId,
    startDate,
    endDate,
  }: ReportsApiParams): Promise<ApiResponse<ReportsByVehicleResponse>> => {
    const params = new URLSearchParams({ companyId });
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await apiClient.instance.get<
      ApiResponse<ReportsByVehicleResponse>
    >(`/reports/by-vehicle?${params.toString()}`);
    return response.data;
  },
};


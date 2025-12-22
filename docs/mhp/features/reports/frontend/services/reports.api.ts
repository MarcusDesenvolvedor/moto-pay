import { apiClient } from '../../../../../../shared/api/api-client';
import {
  DailySummaryResponse,
  ReportsSummaryResponse,
  ApiResponse,
} from '../types/reports.types';

export const reportsApi = {
  getDailySummary: async (): Promise<ApiResponse<DailySummaryResponse>> => {
    const response = await apiClient.instance.get<
      ApiResponse<DailySummaryResponse>
    >('/reports/daily-summary');
    return response.data;
  },

  getReportsSummary: async (
    startDate?: string,
    endDate?: string,
  ): Promise<ApiResponse<ReportsSummaryResponse>> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await apiClient.instance.get<
      ApiResponse<ReportsSummaryResponse>
    >(`/reports/summary?${params.toString()}`);
    return response.data;
  },
};


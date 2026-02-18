import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../services/reports.api';
import { ReportsSummaryItem } from '../types/reports.types';

export interface UseReportsSummaryByPeriodParams {
  companyId: string | null;
  startDate?: string;
  endDate?: string;
}

export function useReportsSummaryByPeriod({
  companyId,
  startDate,
  endDate,
}: UseReportsSummaryByPeriodParams) {
  return useQuery<ReportsSummaryItem[]>({
    queryKey: ['reports', 'summary', companyId, startDate, endDate],
    queryFn: async () => {
      if (!companyId) throw new Error('companyId is required');
      const response = await reportsApi.getReportsSummary({
        companyId,
        startDate,
        endDate,
      });
      return response.data.data;
    },
    enabled: !!companyId,
  });
}

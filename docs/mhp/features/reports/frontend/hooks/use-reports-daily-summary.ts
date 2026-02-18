import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../services/reports.api';
import { DailySummaryResponse } from '../types/reports.types';

function getTodayLocalDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function useReportsDailySummary(companyId: string | null) {
  return useQuery<DailySummaryResponse>({
    queryKey: ['reports', 'daily-summary', companyId, getTodayLocalDate()],
    queryFn: async () => {
      if (!companyId) throw new Error('companyId is required');
      const today = getTodayLocalDate();
      const response = await reportsApi.getDailySummary(companyId, today);
      return response.data;
    },
    enabled: !!companyId,
  });
}

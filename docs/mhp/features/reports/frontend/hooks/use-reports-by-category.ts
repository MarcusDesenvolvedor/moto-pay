import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../services/reports.api';
import { ReportsByCategoryItem } from '../types/reports.types';

export interface UseReportsByCategoryParams {
  companyId: string | null;
  startDate?: string;
  endDate?: string;
  vehicleId?: string;
}

export function useReportsByCategory({
  companyId,
  startDate,
  endDate,
  vehicleId,
}: UseReportsByCategoryParams) {
  return useQuery<ReportsByCategoryItem[]>({
    queryKey: ['reports', 'by-category', companyId, startDate, endDate, vehicleId],
    queryFn: async () => {
      if (!companyId) throw new Error('companyId is required');
      const response = await reportsApi.getReportsByCategory({
        companyId,
        startDate,
        endDate,
        vehicleId,
      });
      return response.data.data;
    },
    enabled: !!companyId,
  });
}

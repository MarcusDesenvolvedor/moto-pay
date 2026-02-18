import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../services/reports.api';
import { ReportsByVehicleItem } from '../types/reports.types';

export interface UseReportsByVehicleParams {
  companyId: string | null;
  startDate?: string;
  endDate?: string;
}

export function useReportsByVehicle({
  companyId,
  startDate,
  endDate,
}: UseReportsByVehicleParams) {
  return useQuery<ReportsByVehicleItem[]>({
    queryKey: ['reports', 'by-vehicle', companyId, startDate, endDate],
    queryFn: async () => {
      if (!companyId) throw new Error('companyId is required');
      const response = await reportsApi.getReportsByVehicle({
        companyId,
        startDate,
        endDate,
      });
      return response.data.data;
    },
    enabled: !!companyId,
  });
}

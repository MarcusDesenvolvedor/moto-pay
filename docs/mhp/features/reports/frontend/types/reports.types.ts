export interface DailySummaryResponse {
  income: number;
  expense: number;
}

export interface ReportsSummaryItem {
  date: string;
  income: number;
  expense: number;
}

export interface ReportsSummaryResponse {
  data: ReportsSummaryItem[];
}

export interface ReportsByCategoryItem {
  category: string;
  income: number;
  expense: number;
  total: number;
}

export interface ReportsByCategoryResponse {
  data: ReportsByCategoryItem[];
}

export interface ReportsByVehicleItem {
  vehicleId: string | null;
  vehicleName: string;
  income: number;
  expense: number;
  profit: number;
}

export interface ReportsByVehicleResponse {
  data: ReportsByVehicleItem[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export type PeriodPreset = 'day' | 'week' | 'month' | 'custom';

export interface PeriodRange {
  startDate: string;
  endDate: string;
}


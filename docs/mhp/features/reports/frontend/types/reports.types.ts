export interface DailySummaryResponse {
  income: number;
  expense: number;
}

export interface ReportsSummaryResponse {
  data: {
    date: string;
    income: number;
    expense: number;
  }[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}


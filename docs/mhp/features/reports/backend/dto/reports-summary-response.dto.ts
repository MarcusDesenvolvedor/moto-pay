export class ReportsSummaryItemDto {
  date: string;
  income: number;
  expense: number;
}

export class ReportsSummaryResponseDto {
  data: ReportsSummaryItemDto[];
}


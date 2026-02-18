export class ReportsByCategoryItemDto {
  category: string;
  income: number;
  expense: number;
  total: number;
}

export class ReportsByCategoryResponseDto {
  data: ReportsByCategoryItemDto[];
}

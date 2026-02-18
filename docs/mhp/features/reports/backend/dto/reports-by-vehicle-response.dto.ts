export class ReportsByVehicleItemDto {
  vehicleId: string | null;
  vehicleName: string;
  income: number;
  expense: number;
  profit: number;
}

export class ReportsByVehicleResponseDto {
  data: ReportsByVehicleItemDto[];
}

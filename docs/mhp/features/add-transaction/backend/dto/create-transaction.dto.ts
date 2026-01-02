import { IsEnum, IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsString, IsUUID, Min, IsDateString } from 'class-validator';

export enum TransactionType {
  GAIN = 'GAIN',
  EXPENSE = 'EXPENSE',
}

export class CreateTransactionDto {
  @IsEnum(TransactionType, { message: 'Type must be either GAIN or EXPENSE' })
  @IsNotEmpty({ message: 'Type is required' })
  type: TransactionType;

  @IsUUID('4', { message: 'Company ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Company ID is required' })
  companyId: string;

  @IsNumber({}, { message: 'Amount must be a number' })
  @Min(0.01, { message: 'Amount must be greater than 0' })
  @IsNotEmpty({ message: 'Amount is required' })
  amount: number;

  @IsBoolean({ message: 'Paid must be a boolean' })
  @IsNotEmpty({ message: 'Paid is required' })
  paid: boolean;

  @IsDateString({}, { message: 'Record date must be a valid date string (YYYY-MM-DD)' })
  @IsOptional()
  recordDate?: string;

  @IsString({ message: 'Note must be a string' })
  @IsOptional()
  note?: string;

  @IsUUID('4', { message: 'Vehicle ID must be a valid UUID' })
  @IsNotEmpty({ message: 'Vehicle ID is required' })
  vehicleId: string;
}


import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateVehicleDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(1, { message: 'Name must have at least 1 character' })
  name: string;

  @IsString({ message: 'Plate must be a string' })
  @IsOptional()
  plate?: string;

  @IsString({ message: 'Note must be a string' })
  @IsOptional()
  note?: string;
}


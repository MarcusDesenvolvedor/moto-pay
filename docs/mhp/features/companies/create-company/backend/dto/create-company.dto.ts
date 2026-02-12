import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateCompanyDto {
  @IsString({ message: 'Company name must be a string' })
  @IsNotEmpty({ message: 'Company name is required' })
  @MinLength(1, { message: 'Company name must have at least 1 character' })
  name: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;
}











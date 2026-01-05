import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CompaniesService } from '../application/companies.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { CompanyResponseDto } from '../dto/company-response.dto';
import { CurrentUser, CurrentUserPayload } from '../../../../authentication/backend/decorators/current-user.decorator';

@Controller('companies')
@UseGuards(AuthGuard('jwt'))
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createCompany(
    @CurrentUser() user: CurrentUserPayload,
    @Body() createCompanyDto: CreateCompanyDto,
  ): Promise<{ data: CompanyResponseDto }> {
    const company = await this.companiesService.createCompany(
      user.userId,
      createCompanyDto,
    );
    return { data: company };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUserCompanies(
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<{ data: CompanyResponseDto[] }> {
    const companies = await this.companiesService.getUserCompanies(user.userId);
    return { data: companies };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteCompany(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') companyId: string,
  ): Promise<{ data: { message: string } }> {
    const result = await this.companiesService.deleteCompany(
      user.userId,
      companyId,
    );
    return { data: result };
  }
}


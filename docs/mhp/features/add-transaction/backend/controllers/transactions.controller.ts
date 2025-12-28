import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransactionsService } from '../application/transactions.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionResponseDto } from '../dto/transaction-response.dto';
import { CompanyResponseDto } from '../dto/company-response.dto';
import { CurrentUser, CurrentUserPayload } from '../../../authentication/backend/decorators/current-user.decorator';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTransaction(
    @CurrentUser() user: CurrentUserPayload,
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<{ data: TransactionResponseDto }> {
    const transaction = await this.transactionsService.createTransaction(
      user.userId,
      createTransactionDto,
    );
    return { data: transaction };
  }

  @Get('companies')
  @HttpCode(HttpStatus.OK)
  async getUserCompanies(
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<{ data: CompanyResponseDto[] }> {
    const companies = await this.transactionsService.getUserCompanies(user.userId);
    return { data: companies };
  }
}


import { TransactionsService } from '../application/transactions.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionResponseDto } from '../dto/transaction-response.dto';
import { CompanyResponseDto } from '../dto/company-response.dto';
import { CurrentUserPayload } from '../../../authentication/backend/decorators/current-user.decorator';
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    createTransaction(user: CurrentUserPayload, createTransactionDto: CreateTransactionDto): Promise<{
        data: TransactionResponseDto;
    }>;
    getUserCompanies(user: CurrentUserPayload): Promise<{
        data: CompanyResponseDto[];
    }>;
}

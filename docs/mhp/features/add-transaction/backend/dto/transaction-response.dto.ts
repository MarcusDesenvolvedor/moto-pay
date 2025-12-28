export class TransactionResponseDto {
  id: string;
  type: string;
  companyId: string;
  amount: number;
  paid: boolean;
  note?: string;
  recordDate: Date;
  status: string;
  createdAt: Date;
}


export declare enum TransactionType {
    GAIN = "GAIN",
    EXPENSE = "EXPENSE"
}
export declare class CreateTransactionDto {
    type: TransactionType;
    companyId: string;
    amount: number;
    paid: boolean;
    recordDate?: string;
    note?: string;
    vehicleId: string;
}

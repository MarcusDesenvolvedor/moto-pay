export declare enum TransactionType {
    GAIN = "GAIN",
    EXPENSE = "EXPENSE"
}
export declare class Transaction {
    readonly id: string;
    readonly companyId: string;
    readonly type: TransactionType;
    readonly amount: number;
    readonly paid: boolean;
    readonly note: string | null;
    readonly recordDate: Date;
    readonly status: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    constructor(id: string, companyId: string, type: TransactionType, amount: number, paid: boolean, note: string | null, recordDate: Date, status: string, createdAt: Date, updatedAt: Date);
    static create(companyId: string, type: TransactionType, amount: number, paid: boolean, note?: string, recordDate?: string | Date): Transaction;
    isActive(): boolean;
}

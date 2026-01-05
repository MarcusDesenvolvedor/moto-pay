export declare class Company {
    readonly id: string;
    readonly name: string;
    readonly document: string | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt: Date | null;
    constructor(id: string, name: string, document: string | null, createdAt: Date, updatedAt: Date, deletedAt: Date | null);
    static create(name: string, document?: string | null): Company;
    canBeUsed(): boolean;
    delete(): Company;
}

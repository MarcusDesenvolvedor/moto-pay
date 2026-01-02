export declare class Vehicle {
    readonly id: string;
    readonly companyId: string;
    readonly name: string;
    readonly plate: string | null;
    readonly note: string | null;
    readonly type: string;
    readonly isActive: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    constructor(id: string, companyId: string, name: string, plate: string | null, note: string | null, type: string, isActive: boolean, createdAt: Date, updatedAt: Date);
    static create(companyId: string, name: string, plate?: string, note?: string): Vehicle;
    getIsActive(): boolean;
}

import { randomUUID } from 'crypto';

export class Vehicle {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly name: string,
    public readonly plate: string | null,
    public readonly note: string | null,
    public readonly type: string,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(
    companyId: string,
    name: string,
    plate?: string,
    note?: string,
  ): Vehicle {
    const now = new Date();

    return new Vehicle(
      randomUUID(),
      companyId,
      name,
      plate || null,
      note || null,
      'motorcycle', // Default type, can be extended later
      true, // Default to active
      now,
      now,
    );
  }

  getIsActive(): boolean {
    return this.isActive;
  }
}


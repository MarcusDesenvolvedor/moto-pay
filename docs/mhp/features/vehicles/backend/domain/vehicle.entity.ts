import { randomUUID } from 'crypto';

export class Vehicle {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly plate: string | null,
    public readonly note: string | null,
    public readonly type: string,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
  ) {}

  static create(
    userId: string,
    name: string,
    plate?: string,
    note?: string,
  ): Vehicle {
    const now = new Date();

    return new Vehicle(
      randomUUID(),
      userId,
      name,
      plate || null,
      note || null,
      'motorcycle',
      true,
      now,
      now,
      null,
    );
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  delete(): Vehicle {
    const now = new Date();
    return new Vehicle(
      this.id,
      this.userId,
      this.name,
      this.plate,
      this.note,
      this.type,
      this.isActive,
      this.createdAt,
      now,
      now,
    );
  }
}


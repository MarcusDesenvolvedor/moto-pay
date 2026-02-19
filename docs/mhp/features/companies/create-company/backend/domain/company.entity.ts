import { randomUUID } from 'crypto';

export class Company {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly name: string,
    public readonly document: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
  ) {}

  static create(userId: string, name: string, document?: string | null): Company {
    const now = new Date();
    return new Company(
      randomUUID(),
      userId,
      name.trim(),
      document?.trim() || null,
      now,
      now,
      null,
    );
  }

  canBeUsed(): boolean {
    return this.deletedAt === null;
  }

  delete(): Company {
    const now = new Date();
    return new Company(
      this.id,
      this.userId,
      this.name,
      this.document,
      this.createdAt,
      now,
      now,
    );
  }
}


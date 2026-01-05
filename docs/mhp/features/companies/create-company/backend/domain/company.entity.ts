import { randomUUID } from 'crypto';

export class Company {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly document: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
  ) {}

  static create(name: string, document?: string | null): Company {
    const now = new Date();
    return new Company(
      randomUUID(),
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
      this.name,
      this.document,
      this.createdAt,
      now, // Update updatedAt
      now, // Set deletedAt
    );
  }
}


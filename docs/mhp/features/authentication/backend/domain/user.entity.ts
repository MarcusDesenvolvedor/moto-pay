import { randomUUID } from 'crypto';

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly fullName: string,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly deletedAt: Date | null,
  ) {}

  static create(
    email: string,
    passwordHash: string,
    fullName: string,
  ): User {
    const now = new Date();
    return new User(
      randomUUID(),
      email.toLowerCase().trim(),
      passwordHash,
      fullName.trim(),
      true,
      now,
      now,
      null,
    );
  }

  canAuthenticate(): boolean {
    return this.isActive && this.deletedAt === null;
  }

  updateFullName(fullName: string): User {
    return new User(
      this.id,
      this.email,
      this.passwordHash,
      fullName.trim(),
      this.isActive,
      this.createdAt,
      new Date(),
      this.deletedAt,
    );
  }

  deactivate(): User {
    return new User(
      this.id,
      this.email,
      this.passwordHash,
      this.fullName,
      false,
      this.createdAt,
      new Date(),
      this.deletedAt,
    );
  }
}


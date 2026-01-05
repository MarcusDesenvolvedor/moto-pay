import { randomUUID } from 'crypto';

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly fullName: string,
    public readonly avatarUrl: string | null,
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
      null,
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
      this.avatarUrl,
      this.isActive,
      this.createdAt,
      new Date(),
      this.deletedAt,
    );
  }

  updateAvatar(avatarUrl: string | null): User {
    return new User(
      this.id,
      this.email,
      this.passwordHash,
      this.fullName,
      avatarUrl,
      this.isActive,
      this.createdAt,
      new Date(),
      this.deletedAt,
    );
  }

  updatePassword(newPasswordHash: string): User {
    return new User(
      this.id,
      this.email,
      newPasswordHash,
      this.fullName,
      this.avatarUrl,
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
      this.avatarUrl,
      false,
      this.createdAt,
      new Date(),
      this.deletedAt,
    );
  }
}


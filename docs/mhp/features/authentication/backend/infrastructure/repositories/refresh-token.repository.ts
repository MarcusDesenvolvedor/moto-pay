import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { RefreshToken } from '../../domain/refresh-token.entity';
import { IRefreshTokenRepository } from '../../domain/refresh-token.repository.interface';

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByToken(token: string): Promise<RefreshToken | null> {
    // Legacy method - kept for backward compatibility
    // Note: This won't work with hashed tokens, use findByTokenHash instead
    const refreshToken = await this.prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!refreshToken) {
      return null;
    }

    return this.toDomain(refreshToken);
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    // Find token by hashed value
    const refreshToken = await this.prisma.refreshToken.findFirst({
      where: { token: tokenHash },
    });

    if (!refreshToken) {
      return null;
    }

    return this.toDomain(refreshToken);
  }

  async findAllActive(): Promise<RefreshToken[]> {
    const tokens = await this.prisma.refreshToken.findMany({
      where: {
        revoked: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    return tokens.map((token: any) => this.toDomain(token));
  }

  async findByUserId(userId: string): Promise<RefreshToken[]> {
    const tokens = await this.prisma.refreshToken.findMany({
      where: { userId },
    });

    return tokens.map((token: any) => this.toDomain(token));
  }

  async save(token: RefreshToken): Promise<RefreshToken> {
    const tokenData = {
      userId: token.userId,
      token: token.token,
      expiresAt: token.expiresAt,
      revoked: token.revoked,
    };

    const saved = await this.prisma.refreshToken.upsert({
      where: { id: token.id },
      create: {
        id: token.id,
        ...tokenData,
        createdAt: token.createdAt,
      },
      update: tokenData,
    });

    return this.toDomain(saved);
  }

  async revokeToken(tokenHash: string): Promise<void> {
    // Revoke by token hash
    await this.prisma.refreshToken.updateMany({
      where: { token: tokenHash, revoked: false },
      data: { revoked: true },
    });
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
  }

  private toDomain(prismaToken: {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    revoked: boolean;
    createdAt: Date;
  }): RefreshToken {
    return new RefreshToken(
      prismaToken.id,
      prismaToken.userId,
      prismaToken.token,
      prismaToken.expiresAt,
      prismaToken.revoked,
      prismaToken.createdAt,
    );
  }
}


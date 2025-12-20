import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { RefreshToken } from '../../domain/refresh-token.entity';
import { IRefreshTokenRepository } from '../../domain/refresh-token.repository.interface';
export declare class RefreshTokenRepository implements IRefreshTokenRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByToken(token: string): Promise<RefreshToken | null>;
    findByUserId(userId: string): Promise<RefreshToken[]>;
    save(token: RefreshToken): Promise<RefreshToken>;
    revokeToken(token: string): Promise<void>;
    revokeAllUserTokens(userId: string): Promise<void>;
    private toDomain;
}

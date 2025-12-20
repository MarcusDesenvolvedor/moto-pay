import { RefreshToken } from './refresh-token.entity';
export interface IRefreshTokenRepository {
    findByToken(token: string): Promise<RefreshToken | null>;
    findByUserId(userId: string): Promise<RefreshToken[]>;
    save(token: RefreshToken): Promise<RefreshToken>;
    revokeToken(token: string): Promise<void>;
    revokeAllUserTokens(userId: string): Promise<void>;
}

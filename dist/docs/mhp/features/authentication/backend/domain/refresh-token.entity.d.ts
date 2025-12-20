export declare class RefreshToken {
    readonly id: string;
    readonly userId: string;
    readonly token: string;
    readonly expiresAt: Date;
    readonly revoked: boolean;
    readonly createdAt: Date;
    constructor(id: string, userId: string, token: string, expiresAt: Date, revoked: boolean, createdAt: Date);
    static create(userId: string, token: string, expiresAt: Date): RefreshToken;
    isExpired(): boolean;
    isValid(): boolean;
    revoke(): RefreshToken;
}

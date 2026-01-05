export declare class User {
    readonly id: string;
    readonly email: string;
    readonly passwordHash: string;
    readonly fullName: string;
    readonly avatarUrl: string | null;
    readonly isActive: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt: Date | null;
    constructor(id: string, email: string, passwordHash: string, fullName: string, avatarUrl: string | null, isActive: boolean, createdAt: Date, updatedAt: Date, deletedAt: Date | null);
    static create(email: string, passwordHash: string, fullName: string): User;
    canAuthenticate(): boolean;
    updateFullName(fullName: string): User;
    updateAvatar(avatarUrl: string | null): User;
    updatePassword(newPasswordHash: string): User;
    deactivate(): User;
}

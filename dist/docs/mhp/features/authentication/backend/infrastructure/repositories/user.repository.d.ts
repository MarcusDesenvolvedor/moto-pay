import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { User } from '../../domain/user.entity';
import { IUserRepository } from '../../domain/user.repository.interface';
export declare class UserRepository implements IUserRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    save(user: User): Promise<User>;
    emailExists(email: string): Promise<boolean>;
    private toDomain;
}

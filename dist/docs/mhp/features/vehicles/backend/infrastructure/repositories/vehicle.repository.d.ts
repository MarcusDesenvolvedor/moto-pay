import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Vehicle } from '../../domain/vehicle.entity';
import { IVehicleRepository } from '../../domain/vehicle.repository.interface';
export declare class VehicleRepository implements IVehicleRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    save(vehicle: Vehicle): Promise<Vehicle>;
    findById(id: string): Promise<Vehicle | null>;
    findByCompanyId(companyId: string): Promise<Vehicle[]>;
    findByUserId(userId: string): Promise<Vehicle[]>;
    private toDomain;
}

import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { IVehicleRepository } from '../domain/vehicle.repository.interface';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { VehicleResponseDto } from '../dto/vehicle-response.dto';
export declare class VehiclesService {
    private readonly vehicleRepository;
    private readonly prisma;
    constructor(vehicleRepository: IVehicleRepository, prisma: PrismaService);
    createVehicle(userId: string, createVehicleDto: CreateVehicleDto): Promise<VehicleResponseDto>;
    getUserVehicles(userId: string): Promise<VehicleResponseDto[]>;
    private toResponseDto;
}

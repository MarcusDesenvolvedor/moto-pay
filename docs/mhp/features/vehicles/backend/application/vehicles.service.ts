import {
  Injectable,
  Inject,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Vehicle } from '../domain/vehicle.entity';
import { IVehicleRepository } from '../domain/vehicle.repository.interface';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { VehicleResponseDto } from '../dto/vehicle-response.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @Inject('IVehicleRepository')
    private readonly vehicleRepository: IVehicleRepository,
    private readonly prisma: PrismaService,
  ) {}

  async createVehicle(
    userId: string,
    createVehicleDto: CreateVehicleDto,
  ): Promise<VehicleResponseDto> {
    try {
      // Get user's first company (or we could require companyId in DTO)
      const companyUser = await this.prisma.companyUser.findFirst({
        where: {
          userId: userId,
          company: {
            deletedAt: null,
          },
        },
        include: {
          company: true,
        },
      });

      if (!companyUser) {
        throw new ForbiddenException(
          `User ${userId} does not belong to any company`,
        );
      }

      // Create vehicle entity
      const vehicle = Vehicle.create(
        companyUser.companyId,
        createVehicleDto.name,
        createVehicleDto.plate,
        createVehicleDto.note,
      );

      // Save vehicle
      const savedVehicle = await this.vehicleRepository.save(vehicle);

      // Map to response DTO
      return this.toResponseDto(savedVehicle);
    } catch (error) {
      console.error('Error creating vehicle:', error);
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new Error(
        `Failed to create vehicle: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async getUserVehicles(userId: string): Promise<VehicleResponseDto[]> {
    try {
      const vehicles = await this.vehicleRepository.findByUserId(userId);
      return vehicles.map((v) => this.toResponseDto(v));
    } catch (error) {
      console.error('Error getting user vehicles:', error);
      throw new Error(
        `Failed to get vehicles: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  private toResponseDto(vehicle: Vehicle): VehicleResponseDto {
    return {
      id: vehicle.id,
      name: vehicle.name,
      plate: vehicle.plate || undefined,
      note: vehicle.note || undefined,
      companyId: vehicle.companyId,
      createdAt: vehicle.createdAt.toISOString(),
      updatedAt: vehicle.updatedAt.toISOString(),
    };
  }
}


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
      const vehicle = Vehicle.create(
        userId,
        createVehicleDto.name,
        createVehicleDto.plate,
        createVehicleDto.note,
      );

      const savedVehicle = await this.vehicleRepository.save(vehicle);

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

  async deleteVehicle(
    userId: string,
    vehicleId: string,
  ): Promise<{ message: string }> {
    try {
      // Get vehicle
      const vehicle = await this.vehicleRepository.findById(vehicleId);

      if (!vehicle) {
        throw new NotFoundException('Vehicle not found');
      }

      if (vehicle.deletedAt) {
        throw new NotFoundException('Vehicle already deleted');
      }

      if (vehicle.userId !== userId) {
        throw new ForbiddenException(
          'You do not have permission to delete this vehicle',
        );
      }

      // Soft delete vehicle
      const deletedVehicle = vehicle.delete();
      await this.vehicleRepository.save(deletedVehicle);

      return { message: 'Vehicle deleted successfully' };
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      if (error instanceof ForbiddenException || error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(
        `Failed to delete vehicle: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  private toResponseDto(vehicle: Vehicle): VehicleResponseDto {
    return {
      id: vehicle.id,
      name: vehicle.name,
      plate: vehicle.plate || undefined,
      note: vehicle.note || undefined,
      isActive: vehicle.isActive,
      createdAt: vehicle.createdAt.toISOString(),
      updatedAt: vehicle.updatedAt.toISOString(),
    };
  }
}


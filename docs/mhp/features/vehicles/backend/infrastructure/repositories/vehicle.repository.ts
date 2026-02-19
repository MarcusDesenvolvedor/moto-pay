import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Vehicle } from '../../domain/vehicle.entity';
import { IVehicleRepository } from '../../domain/vehicle.repository.interface';
import { Vehicle as PrismaVehicle } from '@prisma/client';

// Extended type to include name and note fields (after migration is applied)
type PrismaVehicleWithNameAndNote = PrismaVehicle & {
  name: string;
  note: string | null;
};

@Injectable()
export class VehicleRepository implements IVehicleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(vehicle: Vehicle): Promise<Vehicle> {
    try {
      const saved = await this.prisma.vehicle.upsert({
        where: { id: vehicle.id },
        create: {
          id: vehicle.id,
          userId: vehicle.userId,
          name: vehicle.name,
          plate: vehicle.plate,
          note: vehicle.note,
          type: vehicle.type,
          isActive: vehicle.isActive,
          createdAt: vehicle.createdAt,
          updatedAt: vehicle.updatedAt,
          deletedAt: vehicle.deletedAt,
        },
        update: {
          name: vehicle.name,
          plate: vehicle.plate,
          note: vehicle.note,
          type: vehicle.type,
          isActive: vehicle.isActive,
          updatedAt: vehicle.updatedAt,
          deletedAt: vehicle.deletedAt,
        },
      });

      return this.toDomain(saved as PrismaVehicleWithNameAndNote);
    } catch (error) {
      console.error('Error saving vehicle:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Vehicle | null> {
    try {
      const vehicle = await this.prisma.vehicle.findUnique({
        where: { id },
      });

      if (!vehicle) {
        return null;
      }

      return this.toDomain(vehicle as PrismaVehicleWithNameAndNote);
    } catch (error) {
      console.error('Error finding vehicle by ID:', error);
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<Vehicle[]> {
    try {
      const vehicles = await this.prisma.vehicle.findMany({
        where: {
          userId,
          deletedAt: null,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return vehicles.map((v) => this.toDomain(v as PrismaVehicleWithNameAndNote));
    } catch (error) {
      console.error('Error finding vehicles by user ID:', error);
      throw error;
    }
  }

  private toDomain(prismaRecord: PrismaVehicleWithNameAndNote): Vehicle {
    return new Vehicle(
      prismaRecord.id,
      prismaRecord.userId,
      prismaRecord.name,
      prismaRecord.plate,
      prismaRecord.note,
      prismaRecord.type,
      prismaRecord.isActive,
      prismaRecord.createdAt,
      prismaRecord.updatedAt,
      prismaRecord.deletedAt,
    );
  }
}


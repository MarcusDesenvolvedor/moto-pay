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
      const saved = await this.prisma.vehicle.create({
        data: {
          id: vehicle.id,
          companyId: vehicle.companyId,
          name: vehicle.name,
          plate: vehicle.plate,
          note: vehicle.note,
          type: vehicle.type,
          isActive: vehicle.isActive,
          createdAt: vehicle.createdAt,
          updatedAt: vehicle.updatedAt,
        },
      });

      return this.toDomain(saved as PrismaVehicleWithNameAndNote);
    } catch (error) {
      console.error('Error saving vehicle:', error);
      throw error;
    }
  }

  async findByCompanyId(companyId: string): Promise<Vehicle[]> {
    try {
      const vehicles = await this.prisma.vehicle.findMany({
        where: {
          companyId: companyId,
          deletedAt: null,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return vehicles.map((v) => this.toDomain(v as PrismaVehicleWithNameAndNote));
    } catch (error) {
      console.error('Error finding vehicles by company ID:', error);
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<Vehicle[]> {
    try {
      // Get all companies the user belongs to
      const companyUsers = await this.prisma.companyUser.findMany({
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

      const companyIds = companyUsers.map((cu) => cu.companyId);

      if (companyIds.length === 0) {
        return [];
      }

      // Get all vehicles from those companies
      const vehicles = await this.prisma.vehicle.findMany({
        where: {
          companyId: {
            in: companyIds,
          },
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
      prismaRecord.companyId,
      prismaRecord.name,
      prismaRecord.plate,
      prismaRecord.note,
      prismaRecord.type,
      prismaRecord.isActive,
      prismaRecord.createdAt,
      prismaRecord.updatedAt,
    );
  }
}


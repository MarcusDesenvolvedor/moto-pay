import { Vehicle } from './vehicle.entity';

export interface IVehicleRepository {
  save(vehicle: Vehicle): Promise<Vehicle>;
  findById(id: string): Promise<Vehicle | null>;
  findByCompanyId(companyId: string): Promise<Vehicle[]>;
  findByUserId(userId: string): Promise<Vehicle[]>;
}


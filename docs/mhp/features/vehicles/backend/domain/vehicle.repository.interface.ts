import { Vehicle } from './vehicle.entity';

export interface IVehicleRepository {
  save(vehicle: Vehicle): Promise<Vehicle>;
  findByCompanyId(companyId: string): Promise<Vehicle[]>;
  findByUserId(userId: string): Promise<Vehicle[]>;
}


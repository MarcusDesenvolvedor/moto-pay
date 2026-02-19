import { Vehicle } from './vehicle.entity';

export interface IVehicleRepository {
  save(vehicle: Vehicle): Promise<Vehicle>;
  findById(id: string): Promise<Vehicle | null>;
  findByUserId(userId: string): Promise<Vehicle[]>;
}


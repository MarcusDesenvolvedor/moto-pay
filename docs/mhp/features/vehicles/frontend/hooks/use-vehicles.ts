import { useQuery } from '@tanstack/react-query';
import { vehiclesApi } from '../api/vehicles.api';
import { Vehicle } from '../types/vehicle.types';

export function useVehicles() {
  return useQuery<Vehicle[]>({
    queryKey: ['vehicles'],
    queryFn: async (): Promise<Vehicle[]> => {
      const response = await vehiclesApi.getVehicles();
      return response.data;
    },
  });
}








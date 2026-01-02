import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiclesApi } from '../api/vehicles.api';
import { CreateVehicleRequest, Vehicle } from '../types/vehicle.types';

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateVehicleRequest): Promise<Vehicle> => {
      const response = await vehiclesApi.createVehicle(data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate vehicles queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
}


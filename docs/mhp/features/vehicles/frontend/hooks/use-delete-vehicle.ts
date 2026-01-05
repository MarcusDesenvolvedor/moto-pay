import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiclesApi } from '../api/vehicles.api';

export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: (vehicleId: string) => vehiclesApi.deleteVehicle(vehicleId),
    onSuccess: () => {
      // Invalidate vehicles queries to refetch updated list
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
}



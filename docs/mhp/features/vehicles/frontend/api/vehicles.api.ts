import { apiClient } from '../../../../../../shared/api/api-client';
import {
  CreateVehicleRequest,
  Vehicle,
  ApiResponse,
} from '../types/vehicle.types';

export const vehiclesApi = {
  createVehicle: async (
    data: CreateVehicleRequest,
  ): Promise<ApiResponse<Vehicle>> => {
    const response = await apiClient.instance.post<ApiResponse<Vehicle>>(
      '/vehicles',
      data,
    );
    return response.data;
  },

  getVehicles: async (): Promise<ApiResponse<Vehicle[]>> => {
    const response = await apiClient.instance.get<ApiResponse<Vehicle[]>>(
      '/vehicles',
    );
    return response.data;
  },
};


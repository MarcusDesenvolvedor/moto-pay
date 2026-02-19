export interface CreateVehicleRequest {
  name: string;
  plate?: string;
  note?: string;
}

export interface Vehicle {
  id: string;
  name: string;
  plate?: string;
  note?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
}


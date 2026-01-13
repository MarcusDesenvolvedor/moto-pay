export interface CreateCompanyRequest {
  name: string;
  description?: string;
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
}








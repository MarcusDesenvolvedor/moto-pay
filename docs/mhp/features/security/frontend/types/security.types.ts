export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface Session {
  id: string;
  platform: 'mobile' | 'web';
  lastActivity: string; // ISO8601
  isCurrent: boolean;
}

export interface ApiResponse<T> {
  data: T;
}











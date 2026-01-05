export class SessionResponseDto {
  id: string;
  platform: 'mobile' | 'web';
  lastActivity: string; // ISO8601
  isCurrent: boolean;
}



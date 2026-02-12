import { IsString, IsNotEmpty } from 'class-validator';

export class UploadAvatarDto {
  @IsString()
  @IsNotEmpty()
  imageUrl: string; // Base64 or data URL from frontend
}










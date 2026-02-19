import { IsNotEmpty, IsString, IsUrl, Matches } from 'class-validator';

const CLOUDINARY_URL_PATTERN =
  /^https:\/\/res\.cloudinary\.com\/[\w-]+\/image\/upload\/.+/;

export class UpdateAvatarUrlDto {
  @IsString()
  @IsNotEmpty({ message: 'Avatar URL is required' })
  @IsUrl()
  @Matches(CLOUDINARY_URL_PATTERN, {
    message: 'Invalid URL: must be a Cloudinary URL',
  })
  avatarUrl: string;
}

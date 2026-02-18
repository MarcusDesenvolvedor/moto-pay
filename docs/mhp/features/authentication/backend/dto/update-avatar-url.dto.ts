import { IsNotEmpty, IsString, IsUrl, Matches } from 'class-validator';

const CLOUDINARY_URL_PATTERN =
  /^https:\/\/res\.cloudinary\.com\/[\w-]+\/image\/upload\/.+/;

export class UpdateAvatarUrlDto {
  @IsString()
  @IsNotEmpty({ message: 'URL do avatar é obrigatória' })
  @IsUrl()
  @Matches(CLOUDINARY_URL_PATTERN, {
    message: 'URL inválida: deve ser uma URL do Cloudinary',
  })
  avatarUrl: string;
}

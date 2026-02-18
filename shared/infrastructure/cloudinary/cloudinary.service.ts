import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  /**
   * Upload image to Cloudinary.
   * @param file - Image buffer (from multipart upload) or base64 data URI
   * @param folder - Folder name (default: avatars)
   * @param publicId - Public ID for the asset
   * @returns Secure URL of the uploaded image
   */
  async uploadImage(
    file: Buffer | string,
    folder: string = 'avatars',
    publicId?: string,
  ): Promise<string> {
    const options: { folder: string; resource_type: 'image'; public_id?: string } = {
      folder,
      resource_type: 'image',
    };
    if (publicId) {
      options.public_id = publicId;
    }

    const result = await new Promise<{ secure_url?: string }>((resolve, reject) => {
      if (Buffer.isBuffer(file)) {
        cloudinary.uploader.upload_stream(options, (err, res) => {
          if (err) reject(err);
          else resolve(res ?? {});
        }).end(file);
      } else {
        cloudinary.uploader.upload(file, options)
          .then(resolve)
          .catch(reject);
      }
    });

    if (!result?.secure_url) {
      throw new Error('Cloudinary upload failed: no URL returned');
    }

    return result.secure_url;
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
    }
  }

  extractPublicIdFromUrl(url: string): string | null {
    const matches = url.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp)/i);
    return matches?.[1] ?? null;
  }
}

import { ConfigService } from '@nestjs/config';
export declare class CloudinaryService {
    private readonly configService;
    constructor(configService: ConfigService);
    uploadImage(fileBuffer: Buffer, folder?: string, publicId?: string): Promise<string>;
    deleteImage(publicId: string): Promise<void>;
    extractPublicIdFromUrl(url: string): string | null;
}

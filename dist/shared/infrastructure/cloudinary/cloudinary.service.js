"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cloudinary_1 = require("cloudinary");
let CloudinaryService = class CloudinaryService {
    constructor(configService) {
        this.configService = configService;
        cloudinary_1.v2.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
        });
    }
    async uploadImage(fileBuffer, folder = 'avatars', publicId) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                folder,
                public_id: publicId,
                resource_type: 'image',
                transformation: [
                    {
                        width: 512,
                        height: 512,
                        crop: 'fill',
                        quality: 'auto',
                        format: 'jpg',
                    },
                ],
            }, (error, result) => {
                if (error) {
                    reject(error);
                }
                else if (result) {
                    resolve(result.secure_url);
                }
                else {
                    reject(new Error('Upload failed: No result returned'));
                }
            });
            uploadStream.end(fileBuffer);
        });
    }
    async deleteImage(publicId) {
        try {
            await cloudinary_1.v2.uploader.destroy(publicId);
        }
        catch (error) {
            console.error('Error deleting image from Cloudinary:', error);
        }
    }
    extractPublicIdFromUrl(url) {
        try {
            const matches = url.match(/\/v\d+\/(.+)\.(jpg|jpeg|png|gif|webp)/i);
            if (matches && matches[1]) {
                return matches[1];
            }
            return null;
        }
        catch {
            return null;
        }
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map
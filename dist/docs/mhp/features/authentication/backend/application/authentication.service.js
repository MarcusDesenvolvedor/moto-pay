"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const user_entity_1 = require("../domain/user.entity");
const refresh_token_entity_1 = require("../domain/refresh-token.entity");
const cloudinary_service_1 = require("../../../../../../shared/infrastructure/cloudinary/cloudinary.service");
let AuthenticationService = class AuthenticationService {
    constructor(userRepository, refreshTokenRepository, jwtService, configService, cloudinaryService) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtService = jwtService;
        this.configService = configService;
        this.cloudinaryService = cloudinaryService;
    }
    async signup(signupDto) {
        const emailExists = await this.userRepository.emailExists(signupDto.email);
        if (emailExists) {
            throw new common_1.ConflictException('Email already registered');
        }
        const passwordHash = await this.hashPassword(signupDto.password);
        const user = user_entity_1.User.create(signupDto.email, passwordHash, signupDto.fullName);
        const savedUser = await this.userRepository.save(user);
        const tokens = await this.generateTokens(savedUser);
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                id: savedUser.id,
                email: savedUser.email,
                fullName: savedUser.fullName,
            },
        };
    }
    async login(loginDto) {
        const user = await this.userRepository.findByEmail(loginDto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.canAuthenticate()) {
            throw new common_1.UnauthorizedException('Account is inactive or deleted');
        }
        const isPasswordValid = await this.verifyPassword(loginDto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const tokens = await this.generateTokens(user);
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
            },
        };
    }
    async refreshToken(refreshToken) {
        const allTokens = await this.refreshTokenRepository.findAllActive();
        let tokenEntity = null;
        for (const storedToken of allTokens) {
            const isValid = await bcrypt.compare(refreshToken, storedToken.token);
            if (isValid && storedToken.isValid()) {
                tokenEntity = storedToken;
                break;
            }
        }
        if (!tokenEntity) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
        const user = await this.userRepository.findById(tokenEntity.userId);
        if (!user || !user.canAuthenticate()) {
            throw new common_1.UnauthorizedException('User not found or inactive');
        }
        const accessToken = await this.generateAccessToken(user);
        return {
            accessToken,
        };
    }
    async logout(refreshToken) {
        const allTokens = await this.refreshTokenRepository.findAllActive();
        for (const storedToken of allTokens) {
            const isValid = await bcrypt.compare(refreshToken, storedToken.token);
            if (isValid) {
                await this.refreshTokenRepository.revokeToken(storedToken.token);
                return;
            }
        }
    }
    async getCurrentUser(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user || !user.canAuthenticate()) {
            throw new common_1.UnauthorizedException('User not found or inactive');
        }
        return {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            avatarUrl: user.avatarUrl,
            isActive: user.isActive,
            createdAt: user.createdAt,
        };
    }
    async updateProfile(userId, updateUserDto) {
        const user = await this.userRepository.findById(userId);
        if (!user || !user.canAuthenticate()) {
            throw new common_1.UnauthorizedException('User not found or inactive');
        }
        const updatedUser = user.updateFullName(updateUserDto.fullName);
        const savedUser = await this.userRepository.save(updatedUser);
        return {
            id: savedUser.id,
            email: savedUser.email,
            fullName: savedUser.fullName,
            avatarUrl: savedUser.avatarUrl,
            isActive: savedUser.isActive,
            createdAt: savedUser.createdAt,
        };
    }
    async uploadAvatar(userId, imageBase64) {
        const user = await this.userRepository.findById(userId);
        if (!user || !user.canAuthenticate()) {
            throw new common_1.UnauthorizedException('User not found or inactive');
        }
        try {
            const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
            const imageBuffer = Buffer.from(base64Data, 'base64');
            const publicId = `avatar_${userId}`;
            const avatarUrl = await this.cloudinaryService.uploadImage(imageBuffer, 'avatars', publicId);
            if (user.avatarUrl) {
                const oldPublicId = this.cloudinaryService.extractPublicIdFromUrl(user.avatarUrl);
                if (oldPublicId) {
                    await this.cloudinaryService.deleteImage(oldPublicId);
                }
            }
            const updatedUser = user.updateAvatar(avatarUrl);
            const savedUser = await this.userRepository.save(updatedUser);
            return {
                id: savedUser.id,
                email: savedUser.email,
                fullName: savedUser.fullName,
                avatarUrl: savedUser.avatarUrl,
                isActive: savedUser.isActive,
                createdAt: savedUser.createdAt,
            };
        }
        catch (error) {
            console.error('Error uploading avatar:', error);
            throw new Error('Failed to upload avatar');
        }
    }
    async updatePassword(userId, updatePasswordDto) {
        const user = await this.userRepository.findById(userId);
        if (!user || !user.canAuthenticate()) {
            throw new common_1.UnauthorizedException('User not found or inactive');
        }
        const isCurrentPasswordValid = await this.verifyPassword(updatePasswordDto.currentPassword, user.passwordHash);
        if (!isCurrentPasswordValid) {
            throw new common_1.UnauthorizedException('Current password is incorrect');
        }
        const newPasswordHash = await this.hashPassword(updatePasswordDto.newPassword);
        const updatedUser = user.updatePassword(newPasswordHash);
        await this.userRepository.save(updatedUser);
        return { message: 'Password updated successfully' };
    }
    async changePassword(userId, changePasswordDto) {
        const user = await this.userRepository.findById(userId);
        if (!user || !user.canAuthenticate()) {
            throw new common_1.UnauthorizedException('User not found or inactive');
        }
        const isCurrentPasswordValid = await this.verifyPassword(changePasswordDto.currentPassword, user.passwordHash);
        if (!isCurrentPasswordValid) {
            throw new common_1.UnauthorizedException('Current password is incorrect');
        }
        const newPasswordHash = await this.hashPassword(changePasswordDto.newPassword);
        const updatedUser = user.updatePassword(newPasswordHash);
        await this.userRepository.save(updatedUser);
        await this.refreshTokenRepository.revokeAllUserTokens(userId);
        return { message: 'Password changed successfully. Please login again.' };
    }
    async getUserSessions(userId, currentTokenHash) {
        const tokens = await this.refreshTokenRepository.findByUserId(userId);
        const activeTokens = tokens.filter((token) => token.isValid());
        return activeTokens.map((token) => {
            const platform = 'mobile';
            return {
                id: token.id,
                platform,
                lastActivity: token.createdAt.toISOString(),
                isCurrent: currentTokenHash ? token.token === currentTokenHash : false,
            };
        });
    }
    async logoutSession(userId, sessionId) {
        const tokens = await this.refreshTokenRepository.findByUserId(userId);
        const token = tokens.find((t) => t.id === sessionId);
        if (!token) {
            throw new common_1.NotFoundException('Session not found');
        }
        if (!token.isValid()) {
            throw new common_1.NotFoundException('Session already expired or revoked');
        }
        const revokedToken = token.revoke();
        await this.refreshTokenRepository.save(revokedToken);
        return { message: 'Session logged out successfully' };
    }
    async logoutAllSessions(userId) {
        await this.refreshTokenRepository.revokeAllUserTokens(userId);
        return { message: 'All sessions logged out successfully' };
    }
    async hashPassword(password) {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }
    async verifyPassword(password, hash) {
        return bcrypt.compare(password, hash);
    }
    async generateTokens(user) {
        const accessToken = await this.generateAccessToken(user);
        const refreshTokenValue = this.generateRandomToken();
        const refreshTokenHash = await this.hashRefreshToken(refreshTokenValue);
        const expiresAt = new Date();
        const refreshTokenDays = this.configService.get('JWT_REFRESH_EXPIRES_DAYS', 30) || 30;
        expiresAt.setDate(expiresAt.getDate() + refreshTokenDays);
        const refreshTokenEntity = refresh_token_entity_1.RefreshToken.create(user.id, refreshTokenHash, expiresAt);
        await this.refreshTokenRepository.save(refreshTokenEntity);
        return {
            accessToken,
            refreshToken: refreshTokenValue,
        };
    }
    async generateAccessToken(user) {
        const payload = {
            sub: user.id,
            email: user.email,
        };
        const accessTokenExpiresIn = this.configService.get('JWT_ACCESS_EXPIRES_IN', '15m') || '15m';
        return await this.jwtService.signAsync(payload, {
            expiresIn: accessTokenExpiresIn,
        });
    }
    async hashRefreshToken(token) {
        const saltRounds = 10;
        return bcrypt.hash(token, saltRounds);
    }
    generateRandomToken() {
        return (0, crypto_1.randomUUID)() + '-' + (0, crypto_1.randomUUID)();
    }
};
exports.AuthenticationService = AuthenticationService;
exports.AuthenticationService = AuthenticationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IUserRepository')),
    __param(1, (0, common_1.Inject)('IRefreshTokenRepository')),
    __metadata("design:paramtypes", [Object, Object, typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object, cloudinary_service_1.CloudinaryService])
], AuthenticationService);
//# sourceMappingURL=authentication.service.js.map
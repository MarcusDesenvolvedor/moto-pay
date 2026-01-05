import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IUserRepository } from '../domain/user.repository.interface';
import { IRefreshTokenRepository } from '../domain/refresh-token.repository.interface';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { ChangePasswordDto } from '../../../security/backend/dto/change-password.dto';
import { SessionResponseDto } from '../../../security/backend/dto/session-response.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { CloudinaryService } from '@/shared/infrastructure/cloudinary/cloudinary.service';
export declare class AuthenticationService {
    private readonly userRepository;
    private readonly refreshTokenRepository;
    private readonly jwtService;
    private readonly configService;
    private readonly cloudinaryService;
    constructor(userRepository: IUserRepository, refreshTokenRepository: IRefreshTokenRepository, jwtService: JwtService, configService: ConfigService, cloudinaryService: CloudinaryService);
    signup(signupDto: SignupDto): Promise<AuthResponseDto>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    logout(refreshToken: string): Promise<void>;
    getCurrentUser(userId: string): Promise<UserResponseDto>;
    updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto>;
    uploadAvatar(userId: string, imageBase64: string): Promise<UserResponseDto>;
    updatePassword(userId: string, updatePasswordDto: UpdatePasswordDto): Promise<{
        message: string;
    }>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    getUserSessions(userId: string, currentTokenHash?: string): Promise<SessionResponseDto[]>;
    logoutSession(userId: string, sessionId: string): Promise<{
        message: string;
    }>;
    logoutAllSessions(userId: string): Promise<{
        message: string;
    }>;
    private hashPassword;
    private verifyPassword;
    private generateTokens;
    private generateAccessToken;
    private hashRefreshToken;
    private generateRandomToken;
}

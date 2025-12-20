import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IUserRepository } from '../domain/user.repository.interface';
import { IRefreshTokenRepository } from '../domain/refresh-token.repository.interface';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { UserResponseDto } from '../dto/user-response.dto';
export declare class AuthenticationService {
    private readonly userRepository;
    private readonly refreshTokenRepository;
    private readonly jwtService;
    private readonly configService;
    constructor(userRepository: IUserRepository, refreshTokenRepository: IRefreshTokenRepository, jwtService: JwtService, configService: ConfigService);
    signup(signupDto: SignupDto): Promise<AuthResponseDto>;
    login(loginDto: LoginDto): Promise<AuthResponseDto>;
    refreshToken(refreshToken: string): Promise<AuthResponseDto>;
    logout(refreshToken: string): Promise<void>;
    getCurrentUser(userId: string): Promise<UserResponseDto>;
    private hashPassword;
    private verifyPassword;
    private generateTokens;
    private generateRandomToken;
}

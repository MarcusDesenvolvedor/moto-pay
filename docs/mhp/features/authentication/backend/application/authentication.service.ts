import {
  ConflictException,
  Injectable,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { User } from '../domain/user.entity';
import { RefreshToken } from '../domain/refresh-token.entity';
import { IUserRepository } from '../domain/user.repository.interface';
import { IRefreshTokenRepository } from '../domain/refresh-token.repository.interface';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IRefreshTokenRepository')
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signup(signupDto: SignupDto): Promise<AuthResponseDto> {
    const emailExists = await this.userRepository.emailExists(signupDto.email);

    if (emailExists) {
      throw new ConflictException('Email already registered');
    }

    const passwordHash = await this.hashPassword(signupDto.password);

    const user = User.create(
      signupDto.email,
      passwordHash,
      signupDto.fullName,
    );

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

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.canAuthenticate()) {
      throw new UnauthorizedException('Account is inactive or deleted');
    }

    const isPasswordValid = await this.verifyPassword(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
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

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    // Get all active refresh tokens and compare with bcrypt
    // We need to check all tokens because we can't reverse the hash
    const allTokens = await this.refreshTokenRepository.findAllActive();
    
    let tokenEntity: RefreshToken | null = null;
    
    // Compare provided token with all stored hashes
    for (const storedToken of allTokens) {
      const isValid = await bcrypt.compare(refreshToken, storedToken.token);
      if (isValid && storedToken.isValid()) {
        tokenEntity = storedToken;
        break;
      }
    }

    if (!tokenEntity) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.userRepository.findById(tokenEntity.userId);

    if (!user || !user.canAuthenticate()) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Generate only a new access token (refresh token remains the same)
    const accessToken = await this.generateAccessToken(user);

    return {
      accessToken,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    // Find and revoke the token by comparing with all stored tokens
    const allTokens = await this.refreshTokenRepository.findAllActive();
    
    for (const storedToken of allTokens) {
      const isValid = await bcrypt.compare(refreshToken, storedToken.token);
      if (isValid) {
        await this.refreshTokenRepository.revokeToken(storedToken.token);
        return;
      }
    }
    
    // If token not found, silently succeed (idempotent logout)
  }

  async getCurrentUser(userId: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);

    if (!user || !user.canAuthenticate()) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  private async verifyPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private async generateTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const accessToken = await this.generateAccessToken(user);

    // Generate refresh token with longer expiration (30 days)
    const refreshTokenValue = this.generateRandomToken();
    const refreshTokenHash = await this.hashRefreshToken(refreshTokenValue);
    
    const expiresAt = new Date();
    const refreshTokenDays = this.configService.get<number>(
      'JWT_REFRESH_EXPIRES_DAYS',
      30,
    ) || 30;
    expiresAt.setDate(expiresAt.getDate() + refreshTokenDays);

    const refreshTokenEntity = RefreshToken.create(
      user.id,
      refreshTokenHash, // Store hashed token
      expiresAt,
    );

    await this.refreshTokenRepository.save(refreshTokenEntity);

    return {
      accessToken,
      refreshToken: refreshTokenValue, // Return plain token to client
    };
  }

  private async generateAccessToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessTokenExpiresIn = this.configService.get<string>(
      'JWT_ACCESS_EXPIRES_IN',
      '15m',
    ) || '15m';

    return await (this.jwtService.signAsync as any)(
      payload,
      {
        expiresIn: accessTokenExpiresIn,
      },
    );
  }

  private async hashRefreshToken(token: string): Promise<string> {
    // Use bcrypt to hash refresh tokens (same as passwords)
    const saltRounds = 10;
    return bcrypt.hash(token, saltRounds);
  }

  private generateRandomToken(): string {
    return randomUUID() + '-' + randomUUID();
  }
}


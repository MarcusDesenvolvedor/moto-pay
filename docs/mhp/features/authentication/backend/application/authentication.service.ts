import {
  BadRequestException,
  ConflictException,
  Injectable,
  Inject,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
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
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { ChangePasswordDto } from '../../../security/backend/dto/change-password.dto';
import { SessionResponseDto } from '../../../security/backend/dto/session-response.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { CloudinaryService } from '@/shared/infrastructure/cloudinary/cloudinary.service';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    @Inject('IRefreshTokenRepository')
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cloudinaryService: CloudinaryService,
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
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }

  async updateProfile(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);

    if (!user || !user.canAuthenticate()) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Update user name
    const updatedUser = user.updateFullName(updateUserDto.fullName);

    // Save updated user
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

  async updateAvatarUrl(
    userId: string,
    avatarUrl: string,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(userId);

    if (!user || !user.canAuthenticate()) {
      throw new UnauthorizedException('User not found or inactive');
    }

    try {
      if (user.avatarUrl) {
        const oldPublicId = this.cloudinaryService.extractPublicIdFromUrl(
          user.avatarUrl,
        );
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
    } catch (error) {
      console.error('Error updating avatar:', error);
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      const message = error instanceof Error ? error.message : 'Falha ao atualizar avatar';
      throw new InternalServerErrorException(message);
    }
  }

  async updatePassword(
    userId: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findById(userId);

    if (!user || !user.canAuthenticate()) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Verify current password
    const isCurrentPasswordValid = await this.verifyPassword(
      updatePasswordDto.currentPassword,
      user.passwordHash,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await this.hashPassword(updatePasswordDto.newPassword);

    // Update user password
    const updatedUser = user.updatePassword(newPasswordHash);

    // Save updated user
    await this.userRepository.save(updatedUser);

    return { message: 'Password updated successfully' };
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findById(userId);

    if (!user || !user.canAuthenticate()) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Verify current password
    const isCurrentPasswordValid = await this.verifyPassword(
      changePasswordDto.currentPassword,
      user.passwordHash,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await this.hashPassword(changePasswordDto.newPassword);

    // Update user password
    const updatedUser = user.updatePassword(newPasswordHash);
    await this.userRepository.save(updatedUser);

    // Invalidate all refresh tokens (security best practice)
    await this.refreshTokenRepository.revokeAllUserTokens(userId);

    return { message: 'Password changed successfully. Please login again.' };
  }

  async getUserSessions(
    userId: string,
    currentTokenHash?: string,
  ): Promise<SessionResponseDto[]> {
    const tokens = await this.refreshTokenRepository.findByUserId(userId);

    // Filter only active (non-revoked, non-expired) tokens
    const activeTokens = tokens.filter((token) => token.isValid());

    // Map to response DTOs
    return activeTokens.map((token) => {
      // Determine platform (simplified - can be enhanced with device info)
      const platform: 'mobile' | 'web' = 'mobile'; // TODO: Extract from token metadata or user agent

      return {
        id: token.id,
        platform,
        lastActivity: token.createdAt.toISOString(), // Use createdAt as lastActivity for now
        isCurrent: currentTokenHash ? token.token === currentTokenHash : false,
      };
    });
  }

  async logoutSession(userId: string, sessionId: string): Promise<{ message: string }> {
    const tokens = await this.refreshTokenRepository.findByUserId(userId);
    const token = tokens.find((t) => t.id === sessionId);

    if (!token) {
      throw new NotFoundException('Session not found');
    }

    if (!token.isValid()) {
      throw new NotFoundException('Session already expired or revoked');
    }

    // Revoke the token
    const revokedToken = token.revoke();
    await this.refreshTokenRepository.save(revokedToken);

    return { message: 'Session logged out successfully' };
  }

  async logoutAllSessions(userId: string): Promise<{ message: string }> {
    await this.refreshTokenRepository.revokeAllUserTokens(userId);
    return { message: 'All sessions logged out successfully' };
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


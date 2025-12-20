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

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    const tokenEntity = await this.refreshTokenRepository.findByToken(
      refreshToken,
    );

    if (!tokenEntity || !tokenEntity.isValid()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.userRepository.findById(tokenEntity.userId);

    if (!user || !user.canAuthenticate()) {
      throw new UnauthorizedException('User not found or inactive');
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

  async logout(refreshToken: string): Promise<void> {
    await this.refreshTokenRepository.revokeToken(refreshToken);
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
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessTokenExpiresIn = this.configService.get<string>(
      'JWT_ACCESS_EXPIRES_IN',
      '15m',
    ) || '15m';

    const accessToken = await (this.jwtService.signAsync as any)(
      payload,
      {
        expiresIn: accessTokenExpiresIn,
      },
    );

    const refreshTokenValue = this.generateRandomToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const refreshTokenEntity = RefreshToken.create(
      user.id,
      refreshTokenValue,
      expiresAt,
    );

    await this.refreshTokenRepository.save(refreshTokenEntity);

    return {
      accessToken,
      refreshToken: refreshTokenValue,
    };
  }

  private generateRandomToken(): string {
    return randomUUID() + '-' + randomUUID();
  }
}


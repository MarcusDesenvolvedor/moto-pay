import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthenticationController } from './controllers/authentication.controller';
import { AuthenticationService } from './application/authentication.service';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { RefreshTokenRepository } from './infrastructure/repositories/refresh-token.repository';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { CloudinaryService } from '@/shared/infrastructure/cloudinary/cloudinary.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET is not defined in environment variables');
        }
        return {
          secret,
          signOptions: {
            expiresIn: configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m') || '15m',
          },
        } as any;
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    UserRepository,
    RefreshTokenRepository,
    JwtStrategy,
    PrismaService,
    CloudinaryService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IRefreshTokenRepository',
      useClass: RefreshTokenRepository,
    },
  ],
  exports: [AuthenticationService, JwtStrategy],
})
export class AuthenticationModule {}


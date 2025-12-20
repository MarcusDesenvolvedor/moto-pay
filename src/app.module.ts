import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from '../docs/mhp/features/authentication/backend/authentication.module';
import { PrismaService } from '../shared/infrastructure/prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthenticationModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}


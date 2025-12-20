import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Database connection established');
    } catch (error) {
      this.logger.error(
        'Failed to connect to database. Please ensure PostgreSQL is running and DATABASE_URL is correct.',
        error,
      );
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}




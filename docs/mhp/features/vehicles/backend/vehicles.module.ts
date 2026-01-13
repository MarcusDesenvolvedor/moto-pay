import { Module } from '@nestjs/common';
import { VehiclesController } from './controllers/vehicles.controller';
import { VehiclesService } from './application/vehicles.service';
import { VehicleRepository } from './infrastructure/repositories/vehicle.repository';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { AuthenticationModule } from '../../authentication/backend/authentication.module';

@Module({
  imports: [AuthenticationModule],
  controllers: [VehiclesController],
  providers: [
    VehiclesService,
    VehicleRepository,
    PrismaService,
    {
      provide: 'IVehicleRepository',
      useClass: VehicleRepository,
    },
  ],
  exports: [VehiclesService],
})
export class VehiclesModule {}







import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VehiclesService } from '../application/vehicles.service';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { VehicleResponseDto } from '../dto/vehicle-response.dto';
import {
  CurrentUser,
  CurrentUserPayload,
} from '../../../authentication/backend/decorators/current-user.decorator';

@Controller('vehicles')
@UseGuards(AuthGuard('jwt'))
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createVehicle(
    @CurrentUser() user: CurrentUserPayload,
    @Body() createVehicleDto: CreateVehicleDto,
  ): Promise<{ data: VehicleResponseDto }> {
    const vehicle = await this.vehiclesService.createVehicle(
      user.userId,
      createVehicleDto,
    );
    return { data: vehicle };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUserVehicles(
    @CurrentUser() user: CurrentUserPayload,
  ): Promise<{ data: VehicleResponseDto[] }> {
    const vehicles = await this.vehiclesService.getUserVehicles(user.userId);
    return { data: vehicles };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteVehicle(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') vehicleId: string,
  ): Promise<{ data: { message: string } }> {
    const result = await this.vehiclesService.deleteVehicle(
      user.userId,
      vehicleId,
    );
    return { data: result };
  }
}


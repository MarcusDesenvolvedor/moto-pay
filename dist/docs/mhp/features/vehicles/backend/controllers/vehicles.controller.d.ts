import { VehiclesService } from '../application/vehicles.service';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { VehicleResponseDto } from '../dto/vehicle-response.dto';
import { CurrentUserPayload } from '../../../authentication/backend/decorators/current-user.decorator';
export declare class VehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    createVehicle(user: CurrentUserPayload, createVehicleDto: CreateVehicleDto): Promise<{
        data: VehicleResponseDto;
    }>;
    getUserVehicles(user: CurrentUserPayload): Promise<{
        data: VehicleResponseDto[];
    }>;
    deleteVehicle(user: CurrentUserPayload, vehicleId: string): Promise<{
        data: {
            message: string;
        };
    }>;
}

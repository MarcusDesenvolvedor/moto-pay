"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehiclesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../../shared/infrastructure/prisma/prisma.service");
const vehicle_entity_1 = require("../domain/vehicle.entity");
let VehiclesService = class VehiclesService {
    constructor(vehicleRepository, prisma) {
        this.vehicleRepository = vehicleRepository;
        this.prisma = prisma;
    }
    async createVehicle(userId, createVehicleDto) {
        try {
            const companyUser = await this.prisma.companyUser.findFirst({
                where: {
                    userId: userId,
                    company: {
                        deletedAt: null,
                    },
                },
                include: {
                    company: true,
                },
            });
            if (!companyUser) {
                throw new common_1.ForbiddenException(`User ${userId} does not belong to any company`);
            }
            const vehicle = vehicle_entity_1.Vehicle.create(companyUser.companyId, createVehicleDto.name, createVehicleDto.plate, createVehicleDto.note);
            const savedVehicle = await this.vehicleRepository.save(vehicle);
            return this.toResponseDto(savedVehicle);
        }
        catch (error) {
            console.error('Error creating vehicle:', error);
            if (error instanceof common_1.ForbiddenException) {
                throw error;
            }
            throw new Error(`Failed to create vehicle: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async getUserVehicles(userId) {
        try {
            const vehicles = await this.vehicleRepository.findByUserId(userId);
            return vehicles.map((v) => this.toResponseDto(v));
        }
        catch (error) {
            console.error('Error getting user vehicles:', error);
            throw new Error(`Failed to get vehicles: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async deleteVehicle(userId, vehicleId) {
        try {
            const vehicle = await this.vehicleRepository.findById(vehicleId);
            if (!vehicle) {
                throw new common_1.NotFoundException('Vehicle not found');
            }
            if (vehicle.deletedAt) {
                throw new common_1.NotFoundException('Vehicle already deleted');
            }
            const companyUser = await this.prisma.companyUser.findFirst({
                where: {
                    companyId: vehicle.companyId,
                    userId: userId,
                },
            });
            if (!companyUser) {
                throw new common_1.ForbiddenException('You do not have permission to delete this vehicle');
            }
            const deletedVehicle = vehicle.delete();
            await this.vehicleRepository.save(deletedVehicle);
            return { message: 'Vehicle deleted successfully' };
        }
        catch (error) {
            console.error('Error deleting vehicle:', error);
            if (error instanceof common_1.ForbiddenException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new Error(`Failed to delete vehicle: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    toResponseDto(vehicle) {
        return {
            id: vehicle.id,
            name: vehicle.name,
            plate: vehicle.plate || undefined,
            note: vehicle.note || undefined,
            companyId: vehicle.companyId,
            isActive: vehicle.isActive,
            createdAt: vehicle.createdAt.toISOString(),
            updatedAt: vehicle.updatedAt.toISOString(),
        };
    }
};
exports.VehiclesService = VehiclesService;
exports.VehiclesService = VehiclesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IVehicleRepository')),
    __metadata("design:paramtypes", [Object, prisma_service_1.PrismaService])
], VehiclesService);
//# sourceMappingURL=vehicles.service.js.map
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../../../../../shared/infrastructure/prisma/prisma.service");
const vehicle_entity_1 = require("../../domain/vehicle.entity");
let VehicleRepository = class VehicleRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async save(vehicle) {
        try {
            const saved = await this.prisma.vehicle.create({
                data: {
                    id: vehicle.id,
                    companyId: vehicle.companyId,
                    name: vehicle.name,
                    plate: vehicle.plate,
                    note: vehicle.note,
                    type: vehicle.type,
                    isActive: vehicle.isActive,
                    createdAt: vehicle.createdAt,
                    updatedAt: vehicle.updatedAt,
                },
            });
            return this.toDomain(saved);
        }
        catch (error) {
            console.error('Error saving vehicle:', error);
            throw error;
        }
    }
    async findByCompanyId(companyId) {
        try {
            const vehicles = await this.prisma.vehicle.findMany({
                where: {
                    companyId: companyId,
                    deletedAt: null,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return vehicles.map((v) => this.toDomain(v));
        }
        catch (error) {
            console.error('Error finding vehicles by company ID:', error);
            throw error;
        }
    }
    async findByUserId(userId) {
        try {
            const companyUsers = await this.prisma.companyUser.findMany({
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
            const companyIds = companyUsers.map((cu) => cu.companyId);
            if (companyIds.length === 0) {
                return [];
            }
            const vehicles = await this.prisma.vehicle.findMany({
                where: {
                    companyId: {
                        in: companyIds,
                    },
                    deletedAt: null,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return vehicles.map((v) => this.toDomain(v));
        }
        catch (error) {
            console.error('Error finding vehicles by user ID:', error);
            throw error;
        }
    }
    toDomain(prismaRecord) {
        return new vehicle_entity_1.Vehicle(prismaRecord.id, prismaRecord.companyId, prismaRecord.name, prismaRecord.plate, prismaRecord.note, prismaRecord.type, prismaRecord.isActive, prismaRecord.createdAt, prismaRecord.updatedAt);
    }
};
exports.VehicleRepository = VehicleRepository;
exports.VehicleRepository = VehicleRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VehicleRepository);
//# sourceMappingURL=vehicle.repository.js.map
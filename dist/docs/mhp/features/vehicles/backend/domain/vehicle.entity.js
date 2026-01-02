"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vehicle = void 0;
const crypto_1 = require("crypto");
class Vehicle {
    constructor(id, companyId, name, plate, note, type, isActive, createdAt, updatedAt) {
        this.id = id;
        this.companyId = companyId;
        this.name = name;
        this.plate = plate;
        this.note = note;
        this.type = type;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(companyId, name, plate, note) {
        const now = new Date();
        return new Vehicle((0, crypto_1.randomUUID)(), companyId, name, plate || null, note || null, 'motorcycle', true, now, now);
    }
    getIsActive() {
        return this.isActive;
    }
}
exports.Vehicle = Vehicle;
//# sourceMappingURL=vehicle.entity.js.map
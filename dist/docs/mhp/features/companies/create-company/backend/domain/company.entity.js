"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Company = void 0;
const crypto_1 = require("crypto");
class Company {
    constructor(id, name, document, createdAt, updatedAt, deletedAt) {
        this.id = id;
        this.name = name;
        this.document = document;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }
    static create(name, document) {
        const now = new Date();
        return new Company((0, crypto_1.randomUUID)(), name.trim(), document?.trim() || null, now, now, null);
    }
    canBeUsed() {
        return this.deletedAt === null;
    }
    delete() {
        const now = new Date();
        return new Company(this.id, this.name, this.document, this.createdAt, now, now);
    }
}
exports.Company = Company;
//# sourceMappingURL=company.entity.js.map
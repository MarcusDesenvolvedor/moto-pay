"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const crypto_1 = require("crypto");
class User {
    constructor(id, email, passwordHash, fullName, isActive, createdAt, updatedAt, deletedAt) {
        this.id = id;
        this.email = email;
        this.passwordHash = passwordHash;
        this.fullName = fullName;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }
    static create(email, passwordHash, fullName) {
        const now = new Date();
        return new User((0, crypto_1.randomUUID)(), email.toLowerCase().trim(), passwordHash, fullName.trim(), true, now, now, null);
    }
    canAuthenticate() {
        return this.isActive && this.deletedAt === null;
    }
    updateFullName(fullName) {
        return new User(this.id, this.email, this.passwordHash, fullName.trim(), this.isActive, this.createdAt, new Date(), this.deletedAt);
    }
    deactivate() {
        return new User(this.id, this.email, this.passwordHash, this.fullName, false, this.createdAt, new Date(), this.deletedAt);
    }
}
exports.User = User;
//# sourceMappingURL=user.entity.js.map
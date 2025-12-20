"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshToken = void 0;
const crypto_1 = require("crypto");
class RefreshToken {
    constructor(id, userId, token, expiresAt, revoked, createdAt) {
        this.id = id;
        this.userId = userId;
        this.token = token;
        this.expiresAt = expiresAt;
        this.revoked = revoked;
        this.createdAt = createdAt;
    }
    static create(userId, token, expiresAt) {
        return new RefreshToken((0, crypto_1.randomUUID)(), userId, token, expiresAt, false, new Date());
    }
    isExpired() {
        return new Date() > this.expiresAt;
    }
    isValid() {
        return !this.revoked && !this.isExpired();
    }
    revoke() {
        return new RefreshToken(this.id, this.userId, this.token, this.expiresAt, true, this.createdAt);
    }
}
exports.RefreshToken = RefreshToken;
//# sourceMappingURL=refresh-token.entity.js.map
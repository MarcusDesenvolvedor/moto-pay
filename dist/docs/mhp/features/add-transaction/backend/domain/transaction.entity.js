"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = exports.TransactionType = void 0;
const crypto_1 = require("crypto");
var TransactionType;
(function (TransactionType) {
    TransactionType["GAIN"] = "GAIN";
    TransactionType["EXPENSE"] = "EXPENSE";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
class Transaction {
    constructor(id, companyId, type, amount, paid, note, recordDate, status, vehicleId, createdAt, updatedAt) {
        this.id = id;
        this.companyId = companyId;
        this.type = type;
        this.amount = amount;
        this.paid = paid;
        this.note = note;
        this.recordDate = recordDate;
        this.status = status;
        this.vehicleId = vehicleId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static create(companyId, type, amount, paid, vehicleId, note, recordDate) {
        const now = new Date();
        let transactionRecordDate;
        if (recordDate) {
            if (typeof recordDate === 'string') {
                transactionRecordDate = new Date(recordDate);
            }
            else {
                transactionRecordDate = recordDate;
            }
            transactionRecordDate.setHours(0, 0, 0, 0);
        }
        else {
            transactionRecordDate = new Date();
            transactionRecordDate.setHours(0, 0, 0, 0);
        }
        return new Transaction((0, crypto_1.randomUUID)(), companyId, type, amount, paid, note || null, transactionRecordDate, 'ACTIVE', vehicleId, now, now);
    }
    isActive() {
        return this.status === 'ACTIVE';
    }
}
exports.Transaction = Transaction;
//# sourceMappingURL=transaction.entity.js.map
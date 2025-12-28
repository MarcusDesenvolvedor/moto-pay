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
exports.CreateTransactionDto = exports.TransactionType = void 0;
const class_validator_1 = require("class-validator");
var TransactionType;
(function (TransactionType) {
    TransactionType["GAIN"] = "GAIN";
    TransactionType["EXPENSE"] = "EXPENSE";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
class CreateTransactionDto {
}
exports.CreateTransactionDto = CreateTransactionDto;
__decorate([
    (0, class_validator_1.IsEnum)(TransactionType, { message: 'Type must be either GAIN or EXPENSE' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Type is required' }),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('4', { message: 'Company ID must be a valid UUID' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Company ID is required' }),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'Amount must be a number' }),
    (0, class_validator_1.Min)(0.01, { message: 'Amount must be greater than 0' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Amount is required' }),
    __metadata("design:type", Number)
], CreateTransactionDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)({ message: 'Paid must be a boolean' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Paid is required' }),
    __metadata("design:type", Boolean)
], CreateTransactionDto.prototype, "paid", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'Record date must be a valid date string (YYYY-MM-DD)' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "recordDate", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Note must be a string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTransactionDto.prototype, "note", void 0);
//# sourceMappingURL=create-transaction.dto.js.map
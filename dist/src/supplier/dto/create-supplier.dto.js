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
exports.CreateSupplierDto = exports.TransactionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class TransactionDto {
    OrderNo;
    TransectionDate;
    AmountType;
    paidAmount;
}
exports.TransactionDto = TransactionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ORD-1757698160412' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransactionDto.prototype, "OrderNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date of the order',
        example: '2025-09-12T13:23:06.246Z',
    }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], TransactionDto.prototype, "TransectionDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'why Ammount Pay',
        example: 'cash, by hand, bill, check',
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", String)
], TransactionDto.prototype, "AmountType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Amount paid',
        example: 1500,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TransactionDto.prototype, "paidAmount", void 0);
class CreateSupplierDto {
    fullName;
    cnic;
    phone;
    email;
    address;
    companyName;
    supplyItems;
    status;
    transactions;
    gstNumber;
    bankDetails;
}
exports.CreateSupplierDto = CreateSupplierDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'John Doe', description: 'Full name of the supplier' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSupplierDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '12345-6789012-3', description: 'Unique CNIC number' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSupplierDto.prototype, "cnic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+92-300-1234567', description: 'Supplier phone number' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSupplierDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'supplier@example.com', description: 'Email address of supplier', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateSupplierDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123 Main Street, Karachi', description: 'Supplier address', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSupplierDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ABC Traders', description: 'Company name', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSupplierDto.prototype, "companyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['Cement', 'Bricks'], description: 'List of supply items' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateSupplierDto.prototype, "supplyItems", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Active', enum: ['Active', 'Inactive', 'Blocked'], default: 'Active' }),
    (0, class_validator_1.IsEnum)(['Active', 'Inactive', 'Blocked']),
    __metadata("design:type", String)
], CreateSupplierDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'List of transactions related to this supplier',
        type: [TransactionDto],
        example: [
            {
                orderId: "68c41f3c465b8b6ea8f04860",
                orderDate: "2025-09-12T13:23:06.246Z",
                totalAmount: 4000,
                paidAmount: 1500,
                remainingAmount: 2500
            }
        ]
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => TransactionDto),
    __metadata("design:type", Array)
], CreateSupplierDto.prototype, "transactions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '07XXXXXXXXXX', description: 'GST number if registered', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSupplierDto.prototype, "gstNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'HBL Bank - 1234567890', description: 'Bank details', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSupplierDto.prototype, "bankDetails", void 0);
//# sourceMappingURL=create-supplier.dto.js.map
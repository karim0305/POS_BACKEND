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
exports.CreateCustomerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class SaleDto {
    invoiceNo;
    AmmountType;
    status;
    paidAmount;
    date;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: "INV-12345", description: "Invoice number of the sale" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SaleDto.prototype, "invoiceNo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Cash", description: "Payment type (Cash, Card, Bank etc.)" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SaleDto.prototype, "AmmountType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "COMPLETED", description: "Status can be changed by Refund" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SaleDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 500, description: "Paid amount for the invoice" }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SaleDto.prototype, "paidAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2025-09-14T10:00:00.000Z", description: "Date of sale" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], SaleDto.prototype, "date", void 0);
class CreateCustomerDto {
    name;
    contact;
    email;
    customerType;
    salestransection;
    totalSpent;
    loyaltyPoints;
    tier;
    lastPurchase;
}
exports.CreateCustomerDto = CreateCustomerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Ali Khan", description: "Customer full name" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "03001234567", description: "Customer contact (phone/email)" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "contact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "abc@gmail.com", description: "Customer contact (email)" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "Regular",
        enum: ["Regular", "Premium", "VIP"],
        description: "Customer type",
        default: "Regular",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(["Regular", "Premium", "VIP"]),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "customerType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SaleDto], description: "Sales history of customer" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SaleDto),
    __metadata("design:type", Array)
], CreateCustomerDto.prototype, "salestransection", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1000, description: "Total money spent by customer" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCustomerDto.prototype, "totalSpent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50, description: "Customer loyalty points" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCustomerDto.prototype, "loyaltyPoints", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "Bronze",
        enum: ["Bronze", "Silver", "Gold", "Platinum"],
        description: "Customer tier",
        default: "Bronze",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(["Bronze", "Silver", "Gold", "Platinum"]),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "tier", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "2025-09-14T10:00:00.000Z",
        description: "Last purchase date",
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreateCustomerDto.prototype, "lastPurchase", void 0);
//# sourceMappingURL=create-customer.dto.js.map
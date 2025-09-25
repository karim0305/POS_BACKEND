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
exports.CreateSaleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const sale_enum_1 = require("../enum/sale.enum");
class SaleItemDto {
    product;
    quantity;
    price;
}
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Product ID', example: '64f1c0e1f2b3a2d1a0b0c0d1' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], SaleItemDto.prototype, "product", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantity sold', example: 2 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SaleItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Price per item', example: 25 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SaleItemDto.prototype, "price", void 0);
class CreateSaleDto {
    Invoice;
    customer;
    date;
    items;
    total;
    PayAmmount;
    status;
}
exports.CreateSaleDto = CreateSaleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique invoice number', example: 'SALE-001' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSaleDto.prototype, "Invoice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Customer ID (for registered) OR 'Walk-in Customer' as string",
        example: "68c6a06f0c8b5a6e71a2782f",
    }),
    (0, class_validator_1.ValidateIf)((o) => o.customer !== "Walk-in Customer"),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSaleDto.prototype, "customer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sale date', example: '2025-09-08T00:00:00.000Z', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateSaleDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Products sold', type: [SaleItemDto] }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateSaleDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total sale amount', example: 50 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSaleDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'pay amount', example: 50 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateSaleDto.prototype, "PayAmmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: sale_enum_1.SaleStatus, description: 'Sale status', example: sale_enum_1.SaleStatus.COMPLETED, required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateSaleDto.prototype, "status", void 0);
//# sourceMappingURL=create-sale.dto.js.map
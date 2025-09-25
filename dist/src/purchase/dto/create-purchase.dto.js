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
exports.CreatePurchaseDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const purchase_enum_1 = require("../enum/purchase.enum");
class OrderItemDto {
    product;
    quantity;
    price;
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64f12ab3cd9e4f001234abcd', description: 'Product ID (Mongo ObjectId)' }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], OrderItemDto.prototype, "product", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, minimum: 1, description: 'Quantity of product' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 500, minimum: 0, description: 'Price per product item' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "price", void 0);
class CreatePurchaseDto {
    orderId;
    supplier;
    date;
    items;
    total;
    payAmount;
    expectedDelivery;
    status;
}
exports.CreatePurchaseDto = CreatePurchaseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ORD-001', description: 'Custom Order ID' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePurchaseDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '64f12ab3cd9e4f001234abcd', description: 'Supplier ID (Mongo ObjectId)' }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePurchaseDto.prototype, "supplier", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2025-09-07T12:00:00.000Z', description: 'Order placement date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreatePurchaseDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [OrderItemDto], description: 'List of order items' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => OrderItemDto),
    __metadata("design:type", Array)
], CreatePurchaseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1000, minimum: 0, description: 'Total order amount' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePurchaseDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 300, description: "Amount paid at order time" }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreatePurchaseDto.prototype, "payAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2025-09-20T12:00:00.000Z', description: 'Expected delivery date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Type)(() => Date),
    __metadata("design:type", Date)
], CreatePurchaseDto.prototype, "expectedDelivery", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: purchase_enum_1.OrderStatus, example: purchase_enum_1.OrderStatus.PENDING, description: 'Current order status' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(purchase_enum_1.OrderStatus),
    __metadata("design:type", String)
], CreatePurchaseDto.prototype, "status", void 0);
//# sourceMappingURL=create-purchase.dto.js.map
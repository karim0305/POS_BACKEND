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
exports.SaleSchema = exports.Sale = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const sale_enum_1 = require("../enum/sale.enum");
const swagger_1 = require("@nestjs/swagger");
let Sale = class Sale {
    Invoice;
    customer;
    date;
    items;
    total;
    PayAmmount;
    status;
};
exports.Sale = Sale;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique invoice number', example: 'SALE-001' }),
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Sale.prototype, "Invoice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Customer name', example: 'John Doe' }),
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.Mixed, required: true }),
    __metadata("design:type", Object)
], Sale.prototype, "customer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Sale date', example: '2025-09-08T00:00:00.000Z' }),
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Sale.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Products sold',
        type: [Object],
        example: [
            { product: '64f1c0e1f2b3a2d1a0b0c0d1', quantity: 2, price: 25 },
        ],
    }),
    (0, mongoose_1.Prop)({
        type: [
            {
                product: { type: mongoose_2.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true, min: 1 },
                price: { type: Number, required: true, min: 0 },
            },
        ],
        required: true,
    }),
    __metadata("design:type", Array)
], Sale.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total sale amount', example: 50 }),
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Sale.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Pay amount', example: 50 }),
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Sale.prototype, "PayAmmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: sale_enum_1.SaleStatus, description: 'Sale status', example: sale_enum_1.SaleStatus.COMPLETED }),
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(sale_enum_1.SaleStatus),
        default: sale_enum_1.SaleStatus.COMPLETED,
    }),
    __metadata("design:type", String)
], Sale.prototype, "status", void 0);
exports.Sale = Sale = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Sale);
exports.SaleSchema = mongoose_1.SchemaFactory.createForClass(Sale);
//# sourceMappingURL=sale.schema.js.map
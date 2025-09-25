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
exports.PurchaseSchema = exports.Purchase = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const purchase_enum_1 = require("../enum/purchase.enum");
const supplier_schema_1 = require("../../supplier/schema/supplier.schema");
let Purchase = class Purchase {
    orderId;
    supplier;
    date;
    items;
    total;
    expectedDelivery;
    status;
    payAmount;
};
exports.Purchase = Purchase;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Purchase.prototype, "orderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: supplier_schema_1.Supplier.name, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Purchase.prototype, "supplier", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], Purchase.prototype, "date", void 0);
__decorate([
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
], Purchase.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Purchase.prototype, "total", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Date)
], Purchase.prototype, "expectedDelivery", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(purchase_enum_1.OrderStatus),
        default: purchase_enum_1.OrderStatus.PENDING,
    }),
    __metadata("design:type", String)
], Purchase.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Purchase.prototype, "payAmount", void 0);
exports.Purchase = Purchase = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Purchase);
exports.PurchaseSchema = mongoose_1.SchemaFactory.createForClass(Purchase);
//# sourceMappingURL=purchase.schema.js.map
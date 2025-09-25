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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const purchase_schema_1 = require("../purchase/schema/purchase.schema");
const product_schema_1 = require("../product/schema/product.schema");
const supplier_schema_1 = require("../supplier/schema/supplier.schema");
let PurchaseService = class PurchaseService {
    purchaseModel;
    productModel;
    supplierModel;
    constructor(purchaseModel, productModel, supplierModel) {
        this.purchaseModel = purchaseModel;
        this.productModel = productModel;
        this.supplierModel = supplierModel;
    }
    async create(createPurchaseDto) {
        try {
            const payload = {
                ...createPurchaseDto,
                expectedDelivery: createPurchaseDto.expectedDelivery
                    ? new Date(createPurchaseDto.expectedDelivery)
                    : undefined,
            };
            const purchase = new this.purchaseModel(payload);
            await purchase.save();
            if (purchase.status === 'delivered') {
                const transaction = {
                    OrderNo: purchase.orderId,
                    TransectionDate: new Date(),
                    AmountType: "Bill",
                    paidAmount: createPurchaseDto.payAmount ?? 0,
                };
                await this.supplierModel.findByIdAndUpdate(purchase.supplier, { $push: { transactions: transaction } }, { new: true });
            }
            return {
                success: true,
                message: '✅ Purchase created successfully!',
                data: purchase,
            };
        }
        catch (error) {
            if (error.name === 'ValidationError' &&
                error.errors &&
                error.errors['items.0.product']) {
                throw new common_1.BadRequestException({
                    success: false,
                    message: '❌ Please select a product before saving!',
                });
            }
            throw new common_1.BadRequestException({
                success: false,
                message: error.message || '❌ Something went wrong',
            });
        }
    }
    async findAll() {
        return this.purchaseModel
            .find()
            .populate('supplier')
            .populate('items.product')
            .exec();
    }
    async findOne(id) {
        const purchase = await this.purchaseModel
            .findById(id)
            .populate('supplier')
            .populate('items.product')
            .exec();
        if (!purchase) {
            throw new common_1.BadRequestException({
                success: false,
                message: '❌ Purchase not found',
            });
        }
        return purchase;
    }
    async update(id, updatePurchaseDto) {
        try {
            const updated = await this.purchaseModel
                .findByIdAndUpdate(id, updatePurchaseDto, { new: true })
                .populate('supplier')
                .populate('items.product')
                .exec();
            if (!updated) {
                throw new common_1.BadRequestException({
                    success: false,
                    message: '❌ Purchase not found',
                });
            }
            if (updatePurchaseDto.status?.toUpperCase() === 'DELIVERED') {
                const transaction = {
                    orderId: updated._id,
                    OrderNo: updated.orderId,
                    TransectionDate: new Date(),
                    AmountType: 'Bill',
                    paidAmount: updatePurchaseDto.payAmount ?? updated.payAmount ?? 0,
                };
                const supplierId = updated.supplier instanceof mongoose_2.Types.ObjectId
                    ? updated.supplier
                    : updated.supplier._id;
                await this.supplierModel.findByIdAndUpdate(supplierId, { $push: { transactions: transaction } }, { new: true });
            }
            return {
                success: true,
                message: '✅ Purchase updated successfully!',
                data: updated,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException({
                success: false,
                message: error.message || '❌ Failed to update purchase',
            });
        }
    }
    async remove(id) {
        const deleted = await this.purchaseModel.findByIdAndDelete(id).exec();
        if (!deleted) {
            throw new common_1.BadRequestException({
                success: false,
                message: '❌ Purchase not found',
            });
        }
        return {
            success: true,
            message: '✅ Purchase deleted successfully!',
        };
    }
};
exports.PurchaseService = PurchaseService;
exports.PurchaseService = PurchaseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(purchase_schema_1.Purchase.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(2, (0, mongoose_1.InjectModel)(supplier_schema_1.Supplier.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], PurchaseService);
//# sourceMappingURL=purchase.service.js.map
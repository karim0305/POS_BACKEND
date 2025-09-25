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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("../product/schema/product.schema");
const purchase_schema_1 = require("../purchase/schema/purchase.schema");
const sale_schema_1 = require("../sale/schema/sale.schema");
const cloudinary_1 = require("cloudinary");
let ProductsService = class ProductsService {
    productModel;
    purchaseModel;
    saleModel;
    constructor(productModel, purchaseModel, saleModel) {
        this.productModel = productModel;
        this.purchaseModel = purchaseModel;
        this.saleModel = saleModel;
    }
    async create(createProductDto) {
        try {
            const product = new this.productModel(createProductDto);
            await product.save();
            return {
                success: true,
                message: '✅ Product created successfully!',
                data: product,
            };
        }
        catch (error) {
            if (error.code === 11000) {
                throw new common_1.BadRequestException({
                    success: false,
                    message: '❌ Product already exists',
                });
            }
            throw new common_1.BadRequestException({
                success: false,
                message: error.message || '❌ Failed to create product',
            });
        }
    }
    async findAll() {
        const products = await this.productModel.find().exec();
        for (const product of products) {
            if (!product?._id)
                continue;
            const purchaseAgg = await this.purchaseModel.aggregate([
                { $match: { status: 'delivered' } },
                { $unwind: '$items' },
                { $match: { 'items.product': product._id } },
                { $group: { _id: null, totalPurchased: { $sum: '$items.quantity' } } },
            ]);
            const totalPurchased = purchaseAgg?.[0]?.totalPurchased !== undefined
                ? purchaseAgg[0].totalPurchased
                : 0;
            const saleAgg = await this.saleModel.aggregate([
                { $match: { status: 'COMPLETED' } },
                { $unwind: '$items' },
                { $match: { 'items.product': product._id } },
                { $group: { _id: null, totalSold: { $sum: '$items.quantity' } } },
            ]);
            const totalSold = saleAgg?.[0]?.totalSold !== undefined ? saleAgg[0].totalSold : 0;
            const finalStock = totalPurchased - totalSold;
            product.stock = Math.max(finalStock, 0);
            await product.save().catch((err) => {
                console.error(`Error saving product ${product?._id}:`, err.message);
            });
        }
        return products;
    }
    async findOne(id) {
        const product = await this.productModel.findById(id).exec();
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID "${id}" not found`);
        }
        return product;
    }
    async update(id, updateProductDto) {
        try {
            const updateData = {
                ...updateProductDto,
                ...(updateProductDto.price !== undefined && {
                    price: Number(updateProductDto.price),
                }),
                ...(updateProductDto.stock !== undefined && {
                    stock: Number(updateProductDto.stock),
                }),
            };
            if (updateProductDto.images) {
                updateData.images = updateProductDto.images;
            }
            const updated = await this.productModel
                .findByIdAndUpdate(id, updateData, { new: true })
                .exec();
            if (!updated) {
                throw new common_1.NotFoundException({
                    success: false,
                    message: `❌ Product with ID "${id}" not found`,
                });
            }
            return {
                success: true,
                message: '✅ Product updated successfully!',
                data: updated,
            };
        }
        catch (error) {
            if (error.code === 11000) {
                throw new common_1.BadRequestException({
                    success: false,
                    message: '❌ Duplicate entry: SKU or Barcode already exists',
                });
            }
            throw new common_1.BadRequestException({
                success: false,
                message: error.message || '❌ Failed to update product',
            });
        }
    }
    async remove(id) {
        const product = await this.productModel.findById(id).exec();
        if (!product) {
            throw new common_1.BadRequestException({
                success: false,
                message: '❌ Product ID not found',
            });
        }
        if (product.images && product.images.length > 0) {
            for (const imageUrl of product.images) {
                try {
                    const parts = imageUrl.split('/');
                    const publicIdWithExt = parts[parts.length - 1];
                    const publicId = publicIdWithExt.split('.')[0];
                    await cloudinary_1.v2.uploader.destroy(`nestjs_uploads/${publicId}`);
                }
                catch (err) {
                    console.error('❌ Failed to delete image from Cloudinary:', err.message);
                }
            }
        }
        await product.deleteOne();
        return {
            success: true,
            message: '✅ Product deleted successfully!',
        };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(1, (0, mongoose_1.InjectModel)(purchase_schema_1.Purchase.name)),
    __param(2, (0, mongoose_1.InjectModel)(sale_schema_1.Sale.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ProductsService);
//# sourceMappingURL=product.service.js.map
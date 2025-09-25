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
exports.SupplierService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const supplier_schema_1 = require("./schema/supplier.schema");
const purchase_schema_1 = require("../purchase/schema/purchase.schema");
let SupplierService = class SupplierService {
    supplierModel;
    purchaseModel;
    constructor(supplierModel, purchaseModel) {
        this.supplierModel = supplierModel;
        this.purchaseModel = purchaseModel;
    }
    async create(createSupplierDto) {
        try {
            const supplier = new this.supplierModel(createSupplierDto);
            const saved = await supplier.save();
            return {
                success: true,
                message: '✅ Supplier created successfully',
                data: saved,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException({
                success: false,
                message: '❌ Failed to create supplier',
                error: error.message,
            });
        }
    }
    async getAllSuppliersWithBalance() {
        try {
            const result = await this.supplierModel.aggregate([
                {
                    $lookup: {
                        from: "purchases",
                        let: { supplierId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: [{ $toObjectId: "$supplier" }, "$$supplierId"] },
                                            { $eq: ["$status", "delivered"] }
                                        ]
                                    }
                                }
                            },
                            {
                                $group: {
                                    _id: null,
                                    deliveredTotal: { $sum: "$total" }
                                }
                            }
                        ],
                        as: "purchaseSummary"
                    }
                },
                {
                    $addFields: {
                        totalAmount: {
                            $ifNull: [{ $arrayElemAt: ["$purchaseSummary.deliveredTotal", 0] }, 0]
                        }
                    }
                },
                {
                    $addFields: {
                        totalPaid: { $sum: "$transactions.paidAmount" }
                    }
                },
                {
                    $addFields: {
                        remaining: {
                            $subtract: ["$totalAmount", "$totalPaid"]
                        }
                    }
                },
                {
                    $project: {
                        purchaseSummary: 0
                    }
                }
            ]);
            return {
                success: true,
                message: "✅ All suppliers with balances",
                data: result
            };
        }
        catch (error) {
            throw new common_1.BadRequestException({
                success: false,
                message: error.message || "❌ Failed to fetch suppliers with balances"
            });
        }
    }
    async findOne(id) {
        const supplier = await this.supplierModel.findById(id).exec();
        if (!supplier) {
            throw new common_1.NotFoundException({
                success: false,
                message: '❌ Supplier not found',
            });
        }
        return {
            success: true,
            message: '✅ Supplier fetched successfully',
            data: supplier,
        };
    }
    async update(id, updateData) {
        const supplier = await this.supplierModel
            .findByIdAndUpdate(id, updateData, { new: true })
            .exec();
        if (!supplier) {
            throw new common_1.NotFoundException({
                success: false,
                message: '❌ Supplier not found',
            });
        }
        return {
            success: true,
            message: '✅ Supplier updated successfully',
            data: supplier,
        };
    }
    async remove(id) {
        const supplier = await this.supplierModel.findByIdAndDelete(id).exec();
        if (!supplier) {
            throw new common_1.NotFoundException({
                success: false,
                message: '❌ Supplier not found',
            });
        }
        return {
            success: true,
            message: '✅ Supplier deleted successfully',
        };
    }
    async addTransaction(id, transaction) {
        const updated = await this.supplierModel.findByIdAndUpdate(id, { $push: { transactions: transaction } }, { new: true });
        if (!updated) {
            throw new common_1.NotFoundException(`Supplier with ID ${id} not found`);
        }
        return {
            success: true,
            message: '✅ Transaction added successfully!',
            data: updated,
        };
    }
};
exports.SupplierService = SupplierService;
exports.SupplierService = SupplierService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(supplier_schema_1.Supplier.name)),
    __param(1, (0, mongoose_1.InjectModel)(purchase_schema_1.Purchase.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], SupplierService);
//# sourceMappingURL=supplier.service.js.map
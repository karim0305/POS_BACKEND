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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("../product/schema/product.schema");
const purchase_schema_1 = require("../purchase/schema/purchase.schema");
const sale_schema_1 = require("../sale/schema/sale.schema");
let DashboardService = class DashboardService {
    productModel;
    purchaseModel;
    saleModel;
    constructor(productModel, purchaseModel, saleModel) {
        this.productModel = productModel;
        this.purchaseModel = purchaseModel;
        this.saleModel = saleModel;
    }
    async calculateOverallProfit() {
        const purchaseAgg = await this.purchaseModel.aggregate([
            { $match: { status: 'delivered' } },
            { $group: { _id: null, totalPurchase: { $sum: '$total' } } }
        ]);
        const totalPurchase = purchaseAgg.length > 0 ? purchaseAgg[0].totalPurchase : 0;
        const saleAgg = await this.saleModel.aggregate([
            { $match: { status: 'COMPLETED' } },
            { $group: { _id: null, totalSale: { $sum: '$total' } } }
        ]);
        const totalSale = saleAgg.length > 0 ? saleAgg[0].totalSale : 0;
        const profit = totalSale - totalPurchase;
        return { profit, totalSale, totalPurchase };
    }
    async getRecentSales() {
        return this.saleModel
            .find({ status: 'COMPLETED' })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('customer total createdAt');
    }
    async getMonthlySales() {
        const sales = await this.saleModel.aggregate([
            {
                $match: { status: "COMPLETED" }
            },
            {
                $group: {
                    _id: { $month: "$date" },
                    total: { $sum: "$PayAmmount" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return sales.map(sale => ({
            name: months[sale._id - 1],
            total: sale.total
        }));
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(1, (0, mongoose_1.InjectModel)(purchase_schema_1.Purchase.name)),
    __param(2, (0, mongoose_1.InjectModel)(sale_schema_1.Sale.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map
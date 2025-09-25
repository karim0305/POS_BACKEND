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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const product_schema_1 = require("../product/schema/product.schema");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const purchase_schema_1 = require("../purchase/schema/purchase.schema");
const sale_schema_1 = require("../sale/schema/sale.schema");
let ReportsService = class ReportsService {
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
            {
                $group: {
                    _id: null,
                    totalPurchase: { $sum: '$total' },
                    purchaseCount: { $sum: 1 },
                },
            },
        ]);
        const totalPurchase = purchaseAgg.length > 0 ? purchaseAgg[0].totalPurchase : 0;
        const purchaseCount = purchaseAgg.length > 0 ? purchaseAgg[0].purchaseCount : 0;
        const saleAgg = await this.saleModel.aggregate([
            { $match: { status: 'COMPLETED' } },
            {
                $group: {
                    _id: null,
                    totalSale: { $sum: '$total' },
                    saleCount: { $sum: 1 },
                },
            },
        ]);
        const totalSale = saleAgg.length > 0 ? saleAgg[0].totalSale : 0;
        const saleCount = saleAgg.length > 0 ? saleAgg[0].saleCount : 0;
        const profit = totalSale - totalPurchase;
        console.log("📊 Purchase Total:", totalPurchase, " | Count:", purchaseCount);
        console.log("📊 Sale Total:", totalSale, " | Count:", saleCount);
        console.log("✅ Calculated Profit:", profit);
        return { profit, totalSale, totalPurchase, purchaseCount, saleCount };
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
    async getMonthlyOrdersAndCustomers() {
        const sales = await this.saleModel.aggregate([
            { $match: { status: "COMPLETED" } },
            {
                $group: {
                    _id: { month: { $month: "$date" } },
                    orders: { $sum: 1 },
                    customers: { $addToSet: "$customer" }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id.month",
                    orders: 1,
                    customers: { $size: "$customers" }
                }
            },
            { $sort: { month: 1 } }
        ]);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return sales.map(sale => ({
            name: months[sale.month - 1],
            orders: sale.orders,
            customers: sale.customers
        }));
    }
    async getWeeklySales() {
        const result = await this.saleModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(new Date().setDate(new Date().getDate() - 6)),
                    },
                },
            },
            {
                $group: {
                    _id: { $dayOfWeek: '$createdAt' },
                    sales: { $sum: '$total' },
                    transactions: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    dayOfWeek: '$_id',
                    sales: 1,
                    transactions: 1,
                },
            },
        ]);
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weekData = days.map((day, i) => {
            const found = result.find(r => r.dayOfWeek === i + 1);
            return {
                day,
                sales: found ? found.sales : 0,
                transactions: found ? found.transactions : 0,
            };
        });
        return weekData;
    }
    async getProductSales() {
        const result = await this.saleModel.aggregate([
            { $match: { status: "COMPLETED" } },
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "products",
                    localField: "items.product",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: "$product" },
            {
                $group: {
                    _id: "$product._id",
                    name: { $first: "$product.name" },
                    sku: { $first: "$product.sku" },
                    units: { $sum: "$items.quantity" },
                    revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
                    sales: { $addToSet: "$_id" },
                },
            },
            {
                $project: {
                    _id: 0,
                    id: "$_id",
                    name: 1,
                    sku: 1,
                    units: 1,
                    revenue: 1,
                    sales: { $size: "$sales" },
                },
            },
        ]);
        return result;
    }
    async getSalesByCategory() {
        const result = await this.saleModel.aggregate([
            { $match: { status: "COMPLETED" } },
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "products",
                    localField: "items.product",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: "$product" },
            {
                $group: {
                    _id: "$product.category",
                    value: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
                },
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    value: 1,
                },
            },
            { $sort: { value: -1 } },
        ]);
        const colors = [
            "hsl(var(--chart-1))",
            "hsl(var(--chart-2))",
            "hsl(var(--chart-3))",
            "hsl(var(--chart-4))",
            "hsl(var(--chart-5))",
        ];
        return result.map((r, i) => ({
            ...r,
            color: colors[i % colors.length],
        }));
    }
    async getProductReport() {
        const products = await this.productModel.find();
        const report = await Promise.all(products.map(async (product) => {
            const reorderLevel = product.reorderLevel ?? 10;
            const lastPurchase = await this.purchaseModel
                .findOne({
                "items.product": product._id,
                status: "delivered",
            })
                .sort({ date: -1 });
            const totalSoldAgg = await this.saleModel.aggregate([
                { $match: { status: "COMPLETED" } },
                { $unwind: "$items" },
                { $match: { "items.product": product._id } },
                { $group: { _id: null, totalQty: { $sum: "$items.quantity" } } },
            ]);
            const totalSold = totalSoldAgg.length > 0 ? totalSoldAgg[0].totalQty : 0;
            const avgStock = (product.stock +
                (lastPurchase
                    ? lastPurchase.items[0].quantity + product.stock
                    : product.stock)) / 2;
            const turnoverRate = avgStock > 0 ? (totalSold / avgStock).toFixed(2) : "0";
            let status = "Healthy";
            if (product.stock === 0)
                status = "Out of Stock";
            else if (product.stock < reorderLevel)
                status = "Low Stock";
            else if (product.stock > 2 * reorderLevel)
                status = "Overstocked";
            return {
                product: product.name,
                sku: product.sku,
                currentStock: product.stock,
                reorderLevel,
                lastRestocked: lastPurchase ? lastPurchase.date : null,
                turnoverRate,
                status,
            };
        }));
        return report;
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(product_schema_1.Product.name)),
    __param(1, (0, mongoose_2.InjectModel)(purchase_schema_1.Purchase.name)),
    __param(2, (0, mongoose_2.InjectModel)(sale_schema_1.Sale.name)),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        mongoose_1.Model])
], ReportsService);
//# sourceMappingURL=reports.service.js.map
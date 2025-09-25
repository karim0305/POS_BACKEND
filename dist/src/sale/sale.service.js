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
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const sale_schema_1 = require("../sale/schema/sale.schema");
const product_schema_1 = require("../product/schema/product.schema");
const sale_enum_1 = require("./enum/sale.enum");
const customer_schema_1 = require("../customer/schema/customer.schema");
let SalesService = class SalesService {
    saleModel;
    productModel;
    customerModel;
    constructor(saleModel, productModel, customerModel) {
        this.saleModel = saleModel;
        this.productModel = productModel;
        this.customerModel = customerModel;
    }
    async create(createSaleDto) {
        for (const item of createSaleDto.items) {
            const product = await this.productModel.findById(item.product);
            if (!product) {
                throw new common_1.NotFoundException(`❌ Product with ID ${item.product} not found`);
            }
            if (product.stock < item.quantity) {
                throw new common_1.BadRequestException(`❌ Not enough stock for ${product.name}. Available: ${product.stock}, Required: ${item.quantity}`);
            }
        }
        let customerId = createSaleDto.customer;
        if (!customerId) {
            createSaleDto.customer = "Walk-in Customer";
        }
        const createdSale = new this.saleModel(createSaleDto);
        const savedSale = await createdSale.save();
        if (customerId) {
            await this.customerModel.findByIdAndUpdate(customerId, {
                $push: {
                    salestransection: {
                        invoiceNo: createSaleDto.Invoice,
                        AmmountType: "Bill",
                        paidAmount: createSaleDto.PayAmmount,
                        date: new Date(),
                    },
                },
            });
        }
        return {
            success: true,
            message: `✅ Sale created successfully`,
            data: savedSale,
        };
    }
    async findAll() {
        const sales = await this.saleModel
            .find()
            .populate('items.product')
            .sort({ createdAt: -1 })
            .exec();
        return Promise.all(sales.map(async (sale) => {
            if (mongoose_2.default.Types.ObjectId.isValid(sale.customer)) {
                const customer = await this.customerModel.findById(sale.customer).select('name');
                return {
                    ...sale.toObject(),
                    customer: customer ? customer.name : sale.customer,
                };
            }
            else {
                return {
                    ...sale.toObject(),
                    customer: sale.customer,
                };
            }
        }));
    }
    async findOne(id) {
        const sale = await this.saleModel.findById(id).populate('items.product').exec();
        if (!sale) {
            throw new common_1.NotFoundException(`Sale with ID ${id} not found`);
        }
        let customerName;
        if (mongoose_2.default.Types.ObjectId.isValid(sale.customer)) {
            const customer = await this.customerModel.findById(sale.customer).select('name');
            customerName = customer ? customer.name : 'Unknown Customer';
        }
        else {
            customerName = sale.customer;
        }
        return {
            ...sale.toObject(),
            customer: customerName,
        };
    }
    async remove(id) {
        const result = await this.saleModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException(`Sale with ID ${id} not found`);
        }
    }
    async refund(id) {
        const sale = await this.saleModel.findById(id);
        if (!sale) {
            return { success: false, message: `❌ Sale with ID ${id} not found` };
        }
        if (sale.status === "REFUNDED") {
            return { success: false, message: "❌ This sale is already refunded" };
        }
        sale.status = sale_enum_1.SaleStatus.REFUNDED;
        const updatedSale = await sale.save();
        if (sale.customer && mongoose_2.default.Types.ObjectId.isValid(sale.customer.toString())) {
            await this.customerModel.updateOne({ _id: sale.customer, "salestransection.invoiceNo": sale.Invoice }, { $set: { "salestransection.$.status": "REFUNDED" } });
        }
        return {
            success: true,
            message: "✅ Sale refunded successfully",
            data: updatedSale,
        };
    }
    async getTodayStats() {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const result = await this.saleModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfDay, $lte: endOfDay },
                    status: 'COMPLETED',
                },
            },
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: '$total' },
                    avgSales: { $avg: '$total' },
                    totalItems: { $sum: { $size: '$items' } },
                    count: { $sum: 1 },
                },
            },
        ]);
        if (result.length === 0) {
            return {
                totalSales: 0,
                avgSales: 0,
                totalItems: 0,
                invoices: 0,
            };
        }
        return {
            totalSales: result[0].totalSales,
            avgSales: result[0].avgSales,
            totalItems: result[0].totalItems,
            invoices: result[0].count,
        };
    }
    async update(id, updateSaleDto) {
        const sale = await this.saleModel.findById(id);
        if (!sale) {
            throw new common_1.NotFoundException('Sale not found');
        }
        if (updateSaleDto.items && updateSaleDto.items.length > 0) {
            sale.items = updateSaleDto.items.map((item) => ({
                product: typeof item.product === 'string'
                    ? new mongoose_2.Types.ObjectId(item.product)
                    : item.product,
                quantity: item.quantity,
                price: item.price,
            }));
        }
        if (updateSaleDto.status)
            sale.status = updateSaleDto.status;
        if (updateSaleDto.PayAmmount)
            sale.PayAmmount = updateSaleDto.PayAmmount;
        if (updateSaleDto.total)
            sale.total = updateSaleDto.total;
        sale.updatedAt = new Date();
        const updatedSale = await sale.save();
        if (updateSaleDto.status === 'COMPLETED' && sale.customer) {
            const customer = await this.customerModel.findById(sale.customer);
            if (customer) {
                const transactionIndex = customer.salestransection.findIndex((t) => t.invoiceNo === sale.Invoice);
                if (transactionIndex !== -1) {
                    customer.salestransection[transactionIndex].paidAmount =
                        sale.PayAmmount ||
                            customer.salestransection[transactionIndex].paidAmount;
                    customer.salestransection[transactionIndex].AmmountType =
                        'Bill';
                }
                else {
                    customer.salestransection.push({
                        invoiceNo: sale.Invoice,
                        AmmountType: 'Bill',
                        status: sale.status,
                        paidAmount: sale.PayAmmount || 0,
                        date: new Date(),
                    });
                }
                await customer.save();
            }
        }
        return updatedSale;
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(sale_schema_1.Sale.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(2, (0, mongoose_1.InjectModel)(customer_schema_1.Customer.name)),
    __metadata("design:paramtypes", [mongoose_2.Model, mongoose_2.Model,
        mongoose_2.Model])
], SalesService);
//# sourceMappingURL=sale.service.js.map
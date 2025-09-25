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
exports.CustomerService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const customer_schema_1 = require("./schema/customer.schema");
const sale_schema_1 = require("../sale/schema/sale.schema");
let CustomerService = class CustomerService {
    customerModel;
    saleModel;
    constructor(customerModel, saleModel) {
        this.customerModel = customerModel;
        this.saleModel = saleModel;
    }
    async create(createCustomerDto) {
        try {
            const newCustomer = new this.customerModel(createCustomerDto);
            const saved = await newCustomer.save();
            return {
                success: true,
                message: "✅ Customer created successfully",
                data: saved,
            };
        }
        catch (error) {
            return {
                success: false,
                message: "❌ Failed to create customer",
                error: error.message,
            };
        }
    }
    async findAll() {
        try {
            const salesAggregation = await this.saleModel.aggregate([
                { $match: { status: "COMPLETED" } },
                {
                    $group: {
                        _id: "$customer",
                        totalSaleAmount: { $sum: "$total" },
                    },
                },
            ]);
            const salesMap = new Map(salesAggregation.map((s) => [s._id.toString(), s.totalSaleAmount]));
            const customers = await this.customerModel.find().lean();
            const data = customers.map((customer) => {
                const completedTransactions = (customer.salestransection || []).filter((txn) => txn.status === "COMPLETED");
                const totalPaidAmount = completedTransactions.reduce((sum, txn) => sum + (txn.paidAmount || 0), 0);
                const lastPurchase = completedTransactions.length
                    ? new Date(Math.max(...completedTransactions.map((txn) => new Date(txn.date).getTime())))
                    : null;
                const totalSaleAmount = salesMap.get(customer._id.toString()) || 0;
                const remaining = totalSaleAmount - totalPaidAmount;
                return {
                    ...customer,
                    totalSaleAmount,
                    totalPaidAmount,
                    remaining,
                    lastPurchase,
                };
            });
            return {
                success: true,
                message: "✅ Customers with remaining balances fetched successfully",
                data,
            };
        }
        catch (error) {
            return {
                success: false,
                message: "❌ Failed to fetch customers with balances",
                error: error.message,
            };
        }
    }
    async findOne(id) {
        try {
            const customer = await this.customerModel.findById(id).lean();
            if (!customer) {
                throw new common_1.NotFoundException(`❌ Customer with ID ${id} not found`);
            }
            const totalPaidAmount = (customer.salestransection || []).reduce((sum, txn) => sum + (txn.paidAmount || 0), 0);
            return {
                success: true,
                message: "✅ Customer fetched successfully",
                data: {
                    ...customer,
                    totalPaidAmount,
                },
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message || "❌ Failed to fetch customer",
            };
        }
    }
    async update(id, updateCustomerDto) {
        try {
            const updatedCustomer = await this.customerModel
                .findByIdAndUpdate(id, updateCustomerDto, { new: true })
                .exec();
            if (!updatedCustomer) {
                throw new common_1.NotFoundException(`❌ Customer with ID ${id} not found`);
            }
            return {
                success: true,
                message: "✅ Customer updated successfully",
                data: updatedCustomer,
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message || "❌ Failed to update customer",
            };
        }
    }
    async remove(id) {
        try {
            const result = await this.customerModel.findByIdAndDelete(id).exec();
            if (!result) {
                throw new common_1.NotFoundException(`❌ Customer with ID ${id} not found`);
            }
            return {
                success: true,
                message: "✅ Customer deleted successfully",
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message || "❌ Failed to delete customer",
            };
        }
    }
    async addTransaction(id, transaction) {
        const updated = await this.customerModel.findByIdAndUpdate(id, { $push: { salestransection: transaction } }, { new: true });
        if (!updated) {
            throw new common_1.NotFoundException(`Customer with ID ${id} not found`);
        }
        return {
            success: true,
            message: '✅ Transaction added successfully!',
            data: updated,
        };
    }
};
exports.CustomerService = CustomerService;
exports.CustomerService = CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(customer_schema_1.Customer.name)),
    __param(1, (0, mongoose_1.InjectModel)(sale_schema_1.Sale.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], CustomerService);
//# sourceMappingURL=customer.service.js.map
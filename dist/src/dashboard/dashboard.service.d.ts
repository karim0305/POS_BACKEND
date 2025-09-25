import { Model } from 'mongoose';
import { Product } from '../product/schema/product.schema';
import { Purchase } from '../purchase/schema/purchase.schema';
import { Sale } from '../sale/schema/sale.schema';
export declare class DashboardService {
    private productModel;
    private purchaseModel;
    private saleModel;
    constructor(productModel: Model<Product>, purchaseModel: Model<Purchase>, saleModel: Model<Sale>);
    calculateOverallProfit(): Promise<{
        profit: number;
        totalSale: number;
        totalPurchase: number;
    }>;
    getRecentSales(): Promise<(import("mongoose").Document<unknown, {}, Sale, {}, {}> & Sale & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getMonthlySales(): Promise<{
        name: string;
        total: any;
    }[]>;
}

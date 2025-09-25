import { Product } from 'src/product/schema/product.schema';
import { Model } from 'mongoose';
import { Purchase } from 'src/purchase/schema/purchase.schema';
import { Sale } from 'src/sale/schema/sale.schema';
export declare class ReportsService {
    private productModel;
    private purchaseModel;
    private saleModel;
    constructor(productModel: Model<Product>, purchaseModel: Model<Purchase>, saleModel: Model<Sale>);
    calculateOverallProfit(): Promise<{
        profit: number;
        totalSale: number;
        totalPurchase: number;
        purchaseCount: number;
        saleCount: number;
    }>;
    getMonthlySales(): Promise<{
        name: string;
        total: any;
    }[]>;
    getMonthlyOrdersAndCustomers(): Promise<{
        name: string;
        orders: any;
        customers: any;
    }[]>;
    getWeeklySales(): Promise<{
        day: string;
        sales: any;
        transactions: any;
    }[]>;
    getProductSales(): Promise<any[]>;
    getSalesByCategory(): Promise<any[]>;
    getProductReport(): Promise<{
        product: string;
        sku: string;
        currentStock: number;
        reorderLevel: any;
        lastRestocked: Date | null;
        turnoverRate: string;
        status: string;
    }[]>;
}

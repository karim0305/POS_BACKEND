import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getOverallProfit(): Promise<{
        profit: number;
        totalSale: number;
        totalPurchase: number;
        purchaseCount: number;
        saleCount: number;
    }>;
    getMonthlySales(): Promise<{
        sales: {
            name: string;
            total: any;
        }[];
    }>;
    getMonthlyOrdersAndCustomers(): Promise<{
        sales: {
            name: string;
            orders: any;
            customers: any;
        }[];
    }>;
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

import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getOverallProfit(): Promise<{
        profit: number;
        totalSale: number;
        totalPurchase: number;
    }>;
    getRecentSales(): Promise<{
        sales: (import("mongoose").Document<unknown, {}, import("../sale/schema/sale.schema").Sale, {}, {}> & import("../sale/schema/sale.schema").Sale & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
    }>;
    getMonthlySales(): Promise<{
        sales: {
            name: string;
            total: any;
        }[];
    }>;
}

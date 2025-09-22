import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // GET /dashboard/profit
@Get('profit')
async getOverallProfit() {
  const { profit, totalSale, totalPurchase } = await this.dashboardService.calculateOverallProfit();

  // Console log
  // console.log("📊 Sending to frontend:", { profit, totalSale, totalPurchase });

  return { profit, totalSale, totalPurchase };
}


 @Get('recent-sales')
  async getRecentSales() {
    const recentSales = await this.dashboardService.getRecentSales();
     return { sales: recentSales };
  }

  @Get("monthly-sales")
async getMonthlySales() {
  const monthlySales = await this.dashboardService.getMonthlySales();
  return { sales: monthlySales };
}

}

import { DashboardService } from './../dashboard/dashboard.service';
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReportsService } from './reports.service';
@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService 

  ) {}

  
@Get('profit')
async getOverallProfit() {
  const { profit, totalSale, totalPurchase, purchaseCount, saleCount } = await this.reportsService.calculateOverallProfit();

  // Console log
  console.log("📊 Sending to frontend:", { profit, totalSale, totalPurchase });

  return { profit, totalSale, totalPurchase, purchaseCount, saleCount };
}


@Get("monthly-sales-eport")
async getMonthlySales() {
  const monthlySales = await this.reportsService.getMonthlySales();
  return { sales: monthlySales };
}

@Get("monthly-orders-customers")
async getMonthlyOrdersAndCustomers() {
  const data = await this.reportsService.getMonthlyOrdersAndCustomers();
  return { sales: data };
}


 @Get('weekly')
  async getWeeklySales() {
    return this.reportsService.getWeeklySales();
  }


  @Get("products")
  async getProductSales() {
    return this.reportsService.getProductSales();
  }

    @Get("by-category")
  async getSalesByCategory() {
    return this.reportsService.getSalesByCategory();
  }

   @Get("report")
  async getProductReport() {
    return this.reportsService.getProductReport();
  }
}

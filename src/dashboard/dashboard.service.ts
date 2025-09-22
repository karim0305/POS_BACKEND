import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../product/schema/product.schema';
import { Purchase } from '../purchase/schema/purchase.schema';
import { Sale } from '../sale/schema/sale.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(Purchase.name) private purchaseModel: Model<Purchase>,
    @InjectModel(Sale.name) private saleModel: Model<Sale>,
  ) {}

async calculateOverallProfit(): Promise<{ profit: number; totalSale: number; totalPurchase: number }> {
  // Total delivered purchases (root field `total`)
  const purchaseAgg = await this.purchaseModel.aggregate([
    { $match: { status: 'delivered' } },
    { $group: { _id: null, totalPurchase: { $sum: '$total' } } }
  ]);

  const totalPurchase = purchaseAgg.length > 0 ? purchaseAgg[0].totalPurchase : 0;

  // Total completed sales (root field `total`)
  const saleAgg = await this.saleModel.aggregate([
    { $match: { status: 'COMPLETED' } },
    { $group: { _id: null, totalSale: { $sum: '$total' } } }
  ]);

  const totalSale = saleAgg.length > 0 ? saleAgg[0].totalSale : 0;

  // Profit = Sale - Purchase
  const profit = totalSale - totalPurchase;

  // // 🔎 Debug log
  // console.log("📊 Purchase Total:", totalPurchase);
  // console.log("📊 Sale Total:", totalSale);
  // console.log("✅ Calculated Profit:", profit);

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
      $match: { status: "COMPLETED" } // sirf completed sales
    },
    {
      $group: {
        _id: { $month: "$date" },      // month wise group
        total: { $sum: "$PayAmmount" } // total sales
      }
    },
    { $sort: { "_id": 1 } } // months ko ascending order me
  ]);

  // month numbers ko names me convert karein
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return sales.map(sale => ({
    name: months[sale._id - 1],
    total: sale.total
  }));
}



}

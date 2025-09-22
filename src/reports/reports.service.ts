import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Product } from 'src/product/schema/product.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Purchase } from 'src/purchase/schema/purchase.schema';
import { Sale } from 'src/sale/schema/sale.schema';

@Injectable()
export class ReportsService {
    constructor(
      @InjectModel(Product.name) private productModel: Model<Product>,
      @InjectModel(Purchase.name) private purchaseModel: Model<Purchase>,
      @InjectModel(Sale.name) private saleModel: Model<Sale>,
    ) {}
  
async calculateOverallProfit(): Promise<{
  profit: number;
  totalSale: number;
  totalPurchase: number;
  purchaseCount: number;
  saleCount: number;
}> {
  // Purchases (delivered)
  const purchaseAgg = await this.purchaseModel.aggregate([
    { $match: { status: 'delivered' } },
    {
      $group: {
        _id: null,
        totalPurchase: { $sum: '$total' },
        purchaseCount: { $sum: 1 }, // 👈 count records
      },
    },
  ]);

  const totalPurchase = purchaseAgg.length > 0 ? purchaseAgg[0].totalPurchase : 0;
  const purchaseCount = purchaseAgg.length > 0 ? purchaseAgg[0].purchaseCount : 0;

  // Sales (completed)
  const saleAgg = await this.saleModel.aggregate([
    { $match: { status: 'COMPLETED' } },
    {
      $group: {
        _id: null,
        totalSale: { $sum: '$total' },
        saleCount: { $sum: 1 }, // 👈 count records
      },
    },
  ]);

  const totalSale = saleAgg.length > 0 ? saleAgg[0].totalSale : 0;
  const saleCount = saleAgg.length > 0 ? saleAgg[0].saleCount : 0;

  // Profit = Sale - Purchase
  const profit = totalSale - totalPurchase;

  // Debug logs
  console.log("📊 Purchase Total:", totalPurchase, " | Count:", purchaseCount);
  console.log("📊 Sale Total:", totalSale, " | Count:", saleCount);
  console.log("✅ Calculated Profit:", profit);

  return { profit, totalSale, totalPurchase, purchaseCount, saleCount };
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


async getMonthlyOrdersAndCustomers() {
  const sales = await this.saleModel.aggregate([
    { $match: { status: "COMPLETED" } },
    {
      $group: {
        _id: { month: { $month: "$date" } },
        orders: { $sum: 1 },                // kitne orders
        customers: { $addToSet: "$customer" } // unique customer IDs collect
      }
    },
    {
      $project: {
        _id: 0,
        month: "$_id.month",
        orders: 1,
        customers: { $size: "$customers" }  // unique count
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
          $gte: new Date(new Date().setDate(new Date().getDate() - 6)), // last 7 days
        },
      },
    },
    {
      $group: {
        _id: { $dayOfWeek: '$createdAt' }, // 1=Sun, ... 7=Sat
        sales: { $sum: '$total' },
        transactions: { $sum: 1 }, // count invoices
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

  // Map Mongo days → Mon–Sun order
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
    // ✅ Only completed sales
    { $match: { status: "COMPLETED" } },

    // ✅ Expand items[]
    { $unwind: "$items" },

    // ✅ Join with product details
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },

    // ✅ Group by product across all invoices
    {
      $group: {
        _id: "$product._id",
        name: { $first: "$product.name" },
        sku: { $first: "$product.sku" },

        // total quantity sold
        units: { $sum: "$items.quantity" },

        // revenue based on items sold
        revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },

        // how many different invoices included this product
        sales: { $addToSet: "$_id" },
      },
    },

    // ✅ Compute number of unique invoices
    {
      $project: {
        _id: 0,
        id: "$_id",
        name: 1,
        sku: 1,
        units: 1,
        revenue: 1,
        sales: { $size: "$sales" }, // unique invoice count
      },
    },
  ]);

  return result;
}


 async getSalesByCategory() {
    const result = await this.saleModel.aggregate([
      { $match: { status: "COMPLETED" } }, // ✅ only completed sales
      { $unwind: "$items" }, // flatten items
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
          _id: "$product.category", // group by category
          value: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }, // total revenue
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id", // category name
          value: 1,
        },
      },
      { $sort: { value: -1 } }, // sort high → low
    ]);

    // add colors dynamically (optional)
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

  const report = await Promise.all(
    products.map(async (product) => {
      // ✅ fallback reorder level (default 10 if not present in DB)
      const reorderLevel = (product as any).reorderLevel ?? 10;

      // ✅ last restocked (latest delivered purchase)
      const lastPurchase = await this.purchaseModel
        .findOne({
          "items.product": product._id,
          status: "delivered",
        })
        .sort({ date: -1 });

      // ✅ total sold (only completed sales)
      const totalSoldAgg = await this.saleModel.aggregate([
        { $match: { status: "COMPLETED" } },
        { $unwind: "$items" },
        { $match: { "items.product": product._id } },
        { $group: { _id: null, totalQty: { $sum: "$items.quantity" } } },
      ]);

      const totalSold =
        totalSoldAgg.length > 0 ? totalSoldAgg[0].totalQty : 0;

      // ✅ turnover rate
      const avgStock =
        (product.stock +
          (lastPurchase
            ? lastPurchase.items[0].quantity + product.stock
            : product.stock)) / 2;

      const turnoverRate =
        avgStock > 0 ? (totalSold / avgStock).toFixed(2) : "0";

      // ✅ status logic
      let status = "Healthy";
      if (product.stock === 0) status = "Out of Stock";
      else if (product.stock < reorderLevel) status = "Low Stock";
      else if (product.stock > 2 * reorderLevel) status = "Overstocked";

      return {
        product: product.name,
        sku: product.sku,
        currentStock: product.stock,
        reorderLevel,
        lastRestocked: lastPurchase ? lastPurchase.date : null,
        turnoverRate,
        status,
      };
    }),
  );

  return report;
}



}


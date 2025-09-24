import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Sale, SaleDocument } from '../sale/schema/sale.schema';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Product, ProductDocument } from '../product/schema/product.schema';
import { SaleStatus } from './enum/sale.enum';
import { Customer, CustomerDocument } from 'src/customer/schema/customer.schema';

@Injectable()
export class SalesService {
  constructor(@InjectModel(Sale.name) private saleModel: Model<SaleDocument>, @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
   @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
  ) { }

async create(createSaleDto: CreateSaleDto): Promise<{ success: boolean; message: string; data?: Sale }> {
  // 1️⃣ Stock check
  for (const item of createSaleDto.items) {
    const product = await this.productModel.findById(item.product);
    if (!product) {
      throw new NotFoundException(`❌ Product with ID ${item.product} not found`);
    }
    if (product.stock < item.quantity) {
      throw new BadRequestException(
        `❌ Not enough stock for ${product.name}. Available: ${product.stock}, Required: ${item.quantity}`
      );
    }
  }

  // 2️⃣ Handle customer logic
  let customerId = createSaleDto.customer; // may be string or undefined
  if (!customerId) {
    createSaleDto.customer = "Walk-in Customer"; // default
  }

  // 3️⃣ Save sale
  const createdSale = new this.saleModel(createSaleDto);
  const savedSale = await createdSale.save();

  // 4️⃣ Update customer sales transaction ONLY if customer ID exists
  if (customerId) {
    await this.customerModel.findByIdAndUpdate(customerId, {
      $push: {
        salestransection: {
          invoiceNo: createSaleDto.Invoice,
          AmmountType: "Bill", // default
          paidAmount: createSaleDto.PayAmmount,
          date: new Date(),
        },
      },
    });
  }

  // 5️⃣ Return response
  return {
    success: true,
    message: `✅ Sale created successfully`,
    data: savedSale,
  };
}






async findAll(): Promise<any[]> {
  const sales = await this.saleModel
    .find()
    .populate('items.product')
      .sort({ createdAt: -1 }) 
    .exec();

  // Populate customer manually if it's an ObjectId
  return Promise.all(
    sales.map(async (sale) => {
      if (mongoose.Types.ObjectId.isValid(sale.customer)) {
        const customer = await this.customerModel.findById(sale.customer).select('name');
        return {
          ...sale.toObject(),
          customer: customer ? customer.name : sale.customer,
        };
      } else {
        return {
          ...sale.toObject(),
          customer: sale.customer, // "Walk-in Customer"
        };
      }
    })
  );
}


async findOne(id: string): Promise<any> {
  const sale = await this.saleModel.findById(id).populate('items.product').exec();

  if (!sale) {
    throw new NotFoundException(`Sale with ID ${id} not found`);
  }

  let customerName: string;

  // If it's an ObjectId -> fetch from customer collection
  if (mongoose.Types.ObjectId.isValid(sale.customer as any)) {
    const customer = await this.customerModel.findById(sale.customer).select('name');
    customerName = customer ? customer.name : 'Unknown Customer';
  } else {
    // Already a string like "Walk-in Customer"
    customerName = sale.customer as any;
  }

  return {
    ...sale.toObject(),
    customer: customerName, // override with proper name
  };
}






  async remove(id: string): Promise<void> {
    const result = await this.saleModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }
  }

 async refund(id: string): Promise<{ success: boolean; message: string; data?: Sale }> {
  const sale = await this.saleModel.findById(id);

  if (!sale) {
    return { success: false, message: `❌ Sale with ID ${id} not found` };
  }

  if (sale.status === "REFUNDED") {
    return { success: false, message: "❌ This sale is already refunded" };
  }

  // Sale ko refunded mark karo
  sale.status = SaleStatus.REFUNDED;
  const updatedSale = await sale.save();

  // Agar registered customer hai (ObjectId)
  if (sale.customer && mongoose.Types.ObjectId.isValid(sale.customer.toString())) {
    await this.customerModel.updateOne(
      { _id: sale.customer, "salestransection.invoiceNo": sale.Invoice },
      { $set: { "salestransection.$.status": "REFUNDED" } }
    );
  }

  return {
    success: true,
    message: "✅ Sale refunded successfully",
    data: updatedSale,
  };
}


async getTodayStats() {
    // Get today's start and end time
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Aggregate stats
    const result = await this.saleModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
          status: 'COMPLETED', // optional filter if you only want completed
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$total' },
          avgSales: { $avg: '$total' },
          totalItems: { $sum: { $size: '$items' } }, // count items array length
          count: { $sum: 1 }, // number of invoices
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

// async update(id: string, updateSaleDto: UpdateSaleDto): Promise<Sale> {
//   const sale = await this.saleModel.findById(id);

//   if (!sale) {
//     throw new NotFoundException('Sale not found');
//   }

//   // ✅ Only update items if provided
//   if (updateSaleDto.items && updateSaleDto.items.length > 0) {
//     sale.items = updateSaleDto.items.map((item) => ({
//       product: typeof item.product === 'string' ? new Types.ObjectId(item.product) : item.product,
//       quantity: item.quantity,
//       price: item.price,
//     }));
//   }

//   if (updateSaleDto.status) sale.status = updateSaleDto.status;
//   if (updateSaleDto.PayAmmount) sale.PayAmmount = updateSaleDto.PayAmmount;
//   if (updateSaleDto.total) sale.total = updateSaleDto.total;

//   // ✅ Ensure updatedAt works without touching schema
//   (sale as any).updatedAt = new Date();

//   return await sale.save();
// }


async update(id: string, updateSaleDto: UpdateSaleDto): Promise<Sale> {
  const sale = await this.saleModel.findById(id);
  if (!sale) {
    throw new NotFoundException('Sale not found');
  }

  // --- Update items if provided ---
  if (updateSaleDto.items && updateSaleDto.items.length > 0) {
    sale.items = updateSaleDto.items.map((item) => ({
      product:
        typeof item.product === 'string'
          ? new Types.ObjectId(item.product)
          : item.product,
      quantity: item.quantity,
      price: item.price,
    }));
  }

  if (updateSaleDto.status) sale.status = updateSaleDto.status;
  if (updateSaleDto.PayAmmount) sale.PayAmmount = updateSaleDto.PayAmmount;
  if (updateSaleDto.total) sale.total = updateSaleDto.total;

  (sale as any).updatedAt = new Date();

  const updatedSale = await sale.save();

  // --- Update or push in customer salestransection if status is COMPLETED ---
  if (updateSaleDto.status === 'COMPLETED' && sale.customer) {
    const customer = await this.customerModel.findById(sale.customer);
    if (customer) {
      // Check if transaction with this invoice exists
      const transactionIndex = customer.salestransection.findIndex(
        (t: any) => t.invoiceNo === sale.Invoice,
      );

      if (transactionIndex !== -1) {
        // ✅ Invoice exists -> update paidAmount
        customer.salestransection[transactionIndex].paidAmount =
          sale.PayAmmount ||
          customer.salestransection[transactionIndex].paidAmount;

        // ✅ Also update AmmountType (force-cast to any)
        (customer.salestransection[transactionIndex] as any).AmmountType =
          'Bill'; // default (same as create)
      } else {
        // ✅ Invoice not found -> push new transaction
        (customer.salestransection as any).push({
          invoiceNo: sale.Invoice,
          AmmountType: 'Bill', // 👈 same as create
          status: sale.status,
          paidAmount: sale.PayAmmount || 0,
          date: new Date(),
        } as any);
      }

      await customer.save();
    }
  }

  return updatedSale;
}









  

}

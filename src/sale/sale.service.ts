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
          AmmountType: "Cash", // default
          paidAmount: createSaleDto.PayAmmount,
          date: new Date(),
        },
      },
    });
  }

  // 5️⃣ Return response
  return {
    success: true,
    message: `✅ Sale created successfully}`,
    data: savedSale,
  };
}






async findAll(): Promise<any[]> {
  const sales = await this.saleModel
    .find()
    .populate('items.product')
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


  async findOne(id: string): Promise<Sale> {
    const sale = await this.saleModel.findById(id).populate('items.product').exec();
    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }
    return sale;
  }

  async update(id: string, updateSaleDto: UpdateSaleDto): Promise<Sale> {
    const updatedSale = await this.saleModel
      .findByIdAndUpdate(id, updateSaleDto, { new: true })
      .populate('items.product')
      .exec();

    if (!updatedSale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }
    return updatedSale;
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




}

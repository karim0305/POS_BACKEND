import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Purchase, PurchaseDocument } from '../purchase/schema/purchase.schema';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { Product, ProductDocument } from 'src/product/schema/product.schema';
import { Supplier } from 'src/supplier/schema/supplier.schema';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectModel(Purchase.name) private purchaseModel: Model<PurchaseDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Supplier.name) private readonly supplierModel: Model<ProductDocument>,
    
  ) {}

  // ✅ Create
async create(createPurchaseDto: CreatePurchaseDto) {
  try {
    const payload = {
      ...createPurchaseDto,
      expectedDelivery: createPurchaseDto.expectedDelivery
        ? new Date(createPurchaseDto.expectedDelivery)
        : undefined,
    };

    // 1. Purchase save karo
    const purchase = new this.purchaseModel(payload);
    await purchase.save();

    // 2. Sirf Delivered hone par transaction banao
    if (purchase.status === 'delivered') {
      const transaction = {
        OrderNo: purchase.orderId,                    // ✅ Custom order no
        TransectionDate: new Date(),                  // ✅ Current date
        AmountType: "Bill",     // ✅ DTO se (cash, check, etc.)
        paidAmount: createPurchaseDto.payAmount ?? 0, // ✅ Paid amount
      };

      // 3. Supplier document update karo
      await this.supplierModel.findByIdAndUpdate(
        purchase.supplier, // supplier id from DTO
        { $push: { transactions: transaction } },
        { new: true },
      );
    }

    // 4. Response
    return {
      success: true,
      message: '✅ Purchase created successfully!',
      data: purchase,
    };
  } catch (error) {
    // Agar mongoose error hai aur product missing hai
    if (
      error.name === 'ValidationError' &&
      error.errors &&
      error.errors['items.0.product']
    ) {
      throw new BadRequestException({
        success: false,
        message: '❌ Please select a product before saving!',
      });
    }

    // General error fallback
    throw new BadRequestException({
      success: false,
      message: error.message || '❌ Something went wrong',
    });
  }
}




  // ✅ Get all purchases
  async findAll(): Promise<Purchase[]> {
    return this.purchaseModel
      .find()
      .populate('supplier')
      .populate('items.product')
      .exec();
  }

  // ✅ Get purchase by ID
  async findOne(id: string): Promise<Purchase> {
    const purchase = await this.purchaseModel
      .findById(id)
      .populate('supplier')
      .populate('items.product')
      .exec();

    if (!purchase) {
      throw new BadRequestException({
        success: false,
        message: '❌ Purchase not found',
      });
    }
    return purchase;
  }

  // ✅ Update purchase by ID
async update(
  id: string,
  updatePurchaseDto: UpdatePurchaseDto,
): Promise<{ success: boolean; message: string; data?: Purchase }> {
  try {
    const updated = await this.purchaseModel
      .findByIdAndUpdate(id, updatePurchaseDto, { new: true })
      .populate('supplier')
      .populate('items.product')
      .exec();

    if (!updated) {
      throw new BadRequestException({
        success: false,
        message: '❌ Purchase not found',
      });
    }

    // ✅ Agar status DELIVERED hai to Supplier.transactions me push karo
    if (updatePurchaseDto.status?.toUpperCase() === 'DELIVERED') {
      const transaction = {
        orderId: updated._id,            // Purchase ObjectId
        OrderNo: updated.orderId,        // Custom order no (ORD-xxx)
        TransectionDate: new Date(),     // Current date
        AmountType: 'Bill',              // Hardcoded ya DTO se
        paidAmount:
          updatePurchaseDto.payAmount ?? updated.payAmount ?? 0,
      };

      // ✅ Supplier ka id nikalna (populate kiya ho ya na kiya ho)
      const supplierId =
        updated.supplier instanceof Types.ObjectId
          ? updated.supplier
          : (updated.supplier as any)._id;

      await this.supplierModel.findByIdAndUpdate(
        supplierId,
        { $push: { transactions: transaction } },
        { new: true },
      );
    }

    return {
      success: true,
      message: '✅ Purchase updated successfully!',
      data: updated,
    };
  } catch (error) {
    throw new BadRequestException({
      success: false,
      message: error.message || '❌ Failed to update purchase',
    });
  }
}




  // ✅ Delete purchase by ID
  async remove(
    id: string,
  ): Promise<{ success: boolean; message: string }> {
    const deleted = await this.purchaseModel.findByIdAndDelete(id).exec();

    if (!deleted) {
      throw new BadRequestException({
        success: false,
        message: '❌ Purchase not found',
      });
    }

    return {
      success: true,
      message: '✅ Purchase deleted successfully!',
    };
  }
}

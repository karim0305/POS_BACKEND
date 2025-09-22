import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Supplier, SupplierDocument } from './schema/supplier.schema';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { Purchase, PurchaseDocument } from 'src/purchase/schema/purchase.schema';


@Injectable()
export class SupplierService {
  constructor(
    @InjectModel(Supplier.name) private supplierModel: Model<SupplierDocument>,
     @InjectModel(Purchase.name) private purchaseModel: Model<PurchaseDocument>,
    
  ) {}

  // ✅ Create Supplier
  async create(createSupplierDto: CreateSupplierDto) {
    try {
      const supplier = new this.supplierModel(createSupplierDto);
      const saved = await supplier.save();

      return {
        success: true,
        message: '✅ Supplier created successfully',
        data: saved,
      };
    } catch (error) {
      throw new BadRequestException({
        success: false,
        message: '❌ Failed to create supplier',
        error: error.message,
      });
    }
  }

  // ✅ Get All Suppliers
async getAllSuppliersWithBalance() {
  try {
    const result = await this.supplierModel.aggregate([
      // Purchases join (only delivered)
      {
        $lookup: {
          from: "purchases",
          let: { supplierId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: [ { $toObjectId: "$supplier" }, "$$supplierId" ] }, // Type fix
                    { $eq: ["$status", "delivered"] }
                  ]
                }
              }
            },
            {
              $group: {
                _id: null,
                deliveredTotal: { $sum: "$total" } // Sum of delivered purchase totals
              }
            }
          ],
          as: "purchaseSummary"
        }
      },
      // Flatten purchaseSummary
      {
        $addFields: {
          totalAmount: {
            $ifNull: [ { $arrayElemAt: ["$purchaseSummary.deliveredTotal", 0] }, 0 ]
          }
        }
      },
      // Supplier transactions totalPaid
      {
        $addFields: {
          totalPaid: { $sum: "$transactions.paidAmount" }
        }
      },
      // Remaining balance = totalAmount - totalPaid
      {
        $addFields: {
          remaining: {
            $subtract: ["$totalAmount", "$totalPaid"]
          }
        }
      },
      // Remove only temporary purchaseSummary field
      {
        $project: {
          purchaseSummary: 0
        }
      }
    ]);

    return {
      success: true,
      message: "✅ All suppliers with balances",
      data: result
    };
  } catch (error) {
    throw new BadRequestException({
      success: false,
      message: error.message || "❌ Failed to fetch suppliers with balances"
    });
  }
}














  // ✅ Get Single Supplier
  async findOne(id: string) {
    const supplier = await this.supplierModel.findById(id).exec();
    if (!supplier) {
      throw new NotFoundException({
        success: false,
        message: '❌ Supplier not found',
      });
    }
    return {
      success: true,
      message: '✅ Supplier fetched successfully',
      data: supplier,
    };
  }

  // ✅ Update Supplier
  async update(id: string, updateData: Partial<CreateSupplierDto>) {
    const supplier = await this.supplierModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!supplier) {
      throw new NotFoundException({
        success: false,
        message: '❌ Supplier not found',
      });
    }

    return {
      success: true,
      message: '✅ Supplier updated successfully',
      data: supplier,
    };
  }

  // ✅ Delete Supplier
  async remove(id: string) {
    const supplier = await this.supplierModel.findByIdAndDelete(id).exec();

    if (!supplier) {
      throw new NotFoundException({
        success: false,
        message: '❌ Supplier not found',
      });
    }

    return {
      success: true,
      message: '✅ Supplier deleted successfully',
    };
  }


  async addTransaction(id: string, transaction: any) {
    const updated = await this.supplierModel.findByIdAndUpdate(
      id,
      { $push: { transactions: transaction } },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }

    return {
      success: true,
      message: '✅ Transaction added successfully!',
      data: updated,
    };
  }
}

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Customer, CustomerDocument } from "./schema/customer.schema";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { Sale, SaleDocument } from "src/sale/schema/sale.schema";

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
    @InjectModel(Sale.name) private saleModel: Model<SaleDocument>,
  ) {}

  // ➕ Create Customer
  async create(createCustomerDto: CreateCustomerDto) {
    try {
      const newCustomer = new this.customerModel(createCustomerDto);
      const saved = await newCustomer.save();

      return {
        success: true,
        message: "✅ Customer created successfully",
        data: saved,
      };
    } catch (error) {
      return {
        success: false,
        message: "❌ Failed to create customer",
        error: error.message,
      };
    }
  }

  // 📌 Get All Customers with totalPaidAmount
async findAll() {
  try {
    // 1. Pehle Sales collection ka aggregation
    const salesAggregation = await this.saleModel.aggregate([
      { $match: { status: "COMPLETED" } }, // sirf completed sales
      {
        $group: {
          _id: "$customer", // customer id ke basis pe group
          totalSaleAmount: { $sum: "$total" }, // sale.total ka sum
        },
      },
    ]);

    // Sales aggregation ko map me convert karna fast lookup ke liye
    const salesMap = new Map(
      salesAggregation.map((s) => [s._id.toString(), s.totalSaleAmount])
    );

    // 2. Customers fetch karo
    const customers = await this.customerModel.find().lean();

    // 3. Har customer ke liye calculation
    const data = customers.map((customer) => {
      // ✅ Sirf COMPLETED transactions ka sum (paidAmount)
      const completedTransactions = (customer.salestransection || []).filter(
        (txn) => txn.status === "COMPLETED"
      );

      const totalPaidAmount = completedTransactions.reduce(
        (sum, txn) => sum + (txn.paidAmount || 0),
        0
      );

      // ✅ Latest purchase date
      const lastPurchase = completedTransactions.length
        ? new Date(
            Math.max(...completedTransactions.map((txn) => new Date(txn.date).getTime()))
          )
        : null;

      // ✅ Sales collection se total sale nikalna
      const totalSaleAmount = salesMap.get(customer._id.toString()) || 0;

      // ✅ Remaining balance
      const remaining = totalSaleAmount - totalPaidAmount;

      return {
        ...customer,
        totalSaleAmount, // sale.total ka sum
        totalPaidAmount, // paidAmount ka sum
        remaining,       // kitna reh gaya
        lastPurchase,    // latest completed date
      };
    });

    return {
      success: true,
      message: "✅ Customers with remaining balances fetched successfully",
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: "❌ Failed to fetch customers with balances",
      error: error.message,
    };
  }
}




  // 📌 Get Single Customer by ID with totalPaidAmount
  async findOne(id: string) {
    try {
      const customer = await this.customerModel.findById(id).lean();

      if (!customer) {
        throw new NotFoundException(`❌ Customer with ID ${id} not found`);
      }

      const totalPaidAmount = (customer.salestransection || []).reduce(
        (sum, txn) => sum + (txn.paidAmount || 0),
        0
      );

      return {
        success: true,
        message: "✅ Customer fetched successfully",
        data: {
          ...customer,
          totalPaidAmount,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "❌ Failed to fetch customer",
      };
    }
  }

  // ✏️ Update Customer
  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    try {
      const updatedCustomer = await this.customerModel
        .findByIdAndUpdate(id, updateCustomerDto, { new: true })
        .exec();

      if (!updatedCustomer) {
        throw new NotFoundException(`❌ Customer with ID ${id} not found`);
      }

      return {
        success: true,
        message: "✅ Customer updated successfully",
        data: updatedCustomer,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "❌ Failed to update customer",
      };
    }
  }

  // 🗑️ Delete Customer
  async remove(id: string) {
    try {
      const result = await this.customerModel.findByIdAndDelete(id).exec();

      if (!result) {
        throw new NotFoundException(`❌ Customer with ID ${id} not found`);
      }

      return {
        success: true,
        message: "✅ Customer deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "❌ Failed to delete customer",
      };
    }
  }


  // customer.service.ts
async addTransaction(id: string, transaction: any) {
  const updated = await this.customerModel.findByIdAndUpdate(
    id,
    { $push: { salestransection: transaction } }, // 👈 salestransection me push
    { new: true },
  );

  if (!updated) {
    throw new NotFoundException(`Customer with ID ${id} not found`);
  }

  return {
    success: true,
    message: '✅ Transaction added successfully!',
    data: updated,
  };
}



}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../product/schema/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { error } from 'console';
import { Purchase, PurchaseDocument } from 'src/purchase/schema/purchase.schema';
import { Sale, SaleDocument } from 'src/sale/schema/sale.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
     @InjectModel(Purchase.name) private purchaseModel: Model<PurchaseDocument>,
    @InjectModel(Sale.name) private saleModel: Model<SaleDocument>,
  ) {}

  // ✅ Create new product
  async create(
    createProductDto: CreateProductDto
  ): Promise<{ success: boolean; message: string; data?: Product }> {
    try {
      const product = new this.productModel(createProductDto);
      await product.save();

      return {
        success: true,
        message: "✅ Product created successfully!",
        data: product,
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException({
          success: false,
          message: "❌ Product already exists",
        });
      }

      throw new BadRequestException({
        success: false,
        message: error.message || "❌ Failed to create product",
      });
    }
  }

  // ✅ Find all products
async findAll(): Promise<Product[]> {
  const products = await this.productModel.find().exec();

  for (const product of products) {
    if (!product?._id) continue; // 🛑 guard null/undefined

    // ✅ Total purchased quantity aggregate (only delivered)
    const purchaseAgg = await this.purchaseModel.aggregate([
      { $match: { status: "delivered" } },
      { $unwind: "$items" },
      { $match: { "items.product": product._id } },
      { $group: { _id: null, totalPurchased: { $sum: "$items.quantity" } } },
    ]);

    const totalPurchased =
      purchaseAgg?.[0]?.totalPurchased !== undefined
        ? purchaseAgg[0].totalPurchased
        : 0;

    // ✅ Total sold quantity aggregate (only completed)
    const saleAgg = await this.saleModel.aggregate([
      { $match: { status: "COMPLETED" } },
      { $unwind: "$items" },
      { $match: { "items.product": product._id } },
      { $group: { _id: null, totalSold: { $sum: "$items.quantity" } } },
    ]);

    const totalSold =
      saleAgg?.[0]?.totalSold !== undefined ? saleAgg[0].totalSold : 0;

    // Final stock = purchase - sale
    const finalStock = totalPurchased - totalSold;

    console.log(
      `Product: ${product?.name ?? "Unknown"}, Final Stock: ${finalStock}`
    );

    // 🛑 Prevent negative stock (optional)
    product.stock = Math.max(finalStock, 0);

    // safe save
    await product.save().catch((err) => {
      console.error(`Error saving product ${product?._id}:`, err.message);
    });
  }

  return products;
}




  // ✅ Find one product by ID
  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }
    return product;
  }

  // ✅ Update product by ID
async update(
  id: string,
  updateProductDto: UpdateProductDto & { images?: string[] },
): Promise<{ success: boolean; message: string; data?: Product }> {
  try {
    // Convert numeric fields (since FormData sends strings)
    const updateData: any = {
      ...updateProductDto,
      ...(updateProductDto.price !== undefined && {
        price: Number(updateProductDto.price),
      }),
      ...(updateProductDto.stock !== undefined && {
        stock: Number(updateProductDto.stock),
      }),
    };

    // Handle images (only update if new images are provided)
  

    const updated = await this.productModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException({
        success: false,
        message: `❌ Product with ID "${id}" not found`,
      });
    }

    return {
      success: true,
      message: '✅ Product updated successfully!',
      data: updated,
    };
  } catch (error) {
    if (error.code === 11000) {
      throw new BadRequestException({
        success: false,
        message: '❌ Duplicate entry: SKU or Barcode already exists',
      });
    }

    throw new BadRequestException({
      success: false,
      message: error.message || '❌ Failed to update product',
    });
  }
}


  // ✅ Delete product by ID
  async remove(id: string): Promise<{ success: boolean; message: string }> {
  const result = await this.productModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new BadRequestException({
        success: false,
        message: '❌ Product ID not found',
      });
    }

    return {
      success: true,
      message: '✅ Product deleted successfully!',
    };
  }
}
     
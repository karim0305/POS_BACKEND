import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Purchase, PurchaseSchema } from '../purchase/schema/purchase.schema';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { Product, ProductSchema } from '../product/schema/product.schema'; // ✅ import product schema
import { Supplier, SupplierSchema } from 'src/supplier/schema/supplier.schema';

@Module({
imports: [
  MongooseModule.forFeature([
    { name: Purchase.name, schema: PurchaseSchema },
    { name: Product.name, schema: ProductSchema },
    { name: Supplier.name, schema: SupplierSchema }, 
  ]),
],
  controllers: [PurchaseController],
  providers: [PurchaseService],
  exports: [PurchaseService],
})
export class PurchaseModule {}

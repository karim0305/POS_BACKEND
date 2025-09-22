import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './product.service';
import { ProductsController } from './product.controller';
import { Product, ProductSchema } from '../product/schema/product.schema';
import { Purchase, PurchaseSchema } from 'src/purchase/schema/purchase.schema';
import { Sale, SaleSchema } from 'src/sale/schema/sale.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema },   
      { name: Purchase.name, schema: PurchaseSchema },
      { name: Sale.name, schema: SaleSchema },]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService,MongooseModule],
   
})
export class ProductsModule {}

import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/product/schema/product.schema';
import { Purchase, PurchaseSchema } from 'src/purchase/schema/purchase.schema';
import { Sale, SaleSchema } from 'src/sale/schema/sale.schema';

@Module({
  imports: [
      MongooseModule.forFeature([
        { name: Product.name, schema: ProductSchema },
        { name: Purchase.name, schema: PurchaseSchema },
        { name: Sale.name, schema: SaleSchema },
      ]),
    ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}

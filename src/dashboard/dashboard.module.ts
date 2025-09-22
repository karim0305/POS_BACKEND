import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Product, ProductSchema } from '../product/schema/product.schema';
import { Purchase, PurchaseSchema } from '../purchase/schema/purchase.schema';
import { Sale, SaleSchema } from '../sale/schema/sale.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Purchase.name, schema: PurchaseSchema },
      { name: Sale.name, schema: SaleSchema },
    ]),
  ],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}

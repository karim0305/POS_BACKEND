import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SalesService } from './sale.service';
import { SalesController } from './sale.controller';
import { Sale, SaleSchema } from '../sale/schema/sale.schema'; // import schema
import { Product, ProductSchema } from 'src/product/schema/product.schema';
import { CustomerModule } from 'src/customer/customer.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sale.name, schema: SaleSchema }, // ✅ fixed
          { name: Product.name, schema: ProductSchema }, ]),
         CustomerModule,
  ],

  controllers: [SalesController],
  providers: [SalesService],
  exports: [SalesService],
})
export class SaleModule {}

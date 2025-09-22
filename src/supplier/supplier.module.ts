import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { Supplier, SupplierSchema } from './schema/supplier.schema';
import { Purchase, PurchaseSchema } from 'src/purchase/schema/purchase.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Supplier.name, schema: SupplierSchema },
         { name: Purchase.name, schema: PurchaseSchema },
    ]),
  ],
  controllers: [SupplierController],
  providers: [SupplierService],
  exports: [SupplierService], // agar kisi aur module me use karna ho
})
export class SupplierModule {}

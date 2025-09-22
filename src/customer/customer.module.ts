import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Customer, CustomerSchema } from "../customer/schema/customer.schema";
import { CustomerService } from "./customer.service";
import { CustomerController } from "./customer.controller";
import { Sale, SaleSchema } from "src/sale/schema/sale.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: Customer.name, schema: CustomerSchema },
        { name: Sale.name, schema: SaleSchema },
    ]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  
  exports: [CustomerService, MongooseModule.forFeature([{ name: Customer.name, schema: CustomerSchema }]),],
})
export class CustomerModule {}

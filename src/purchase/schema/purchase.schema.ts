import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OrderStatus } from '../enum/purchase.enum';
import { Supplier } from 'src/supplier/schema/supplier.schema';

export type PurchaseDocument = Purchase & Document;

@Schema({ timestamps: true })
export class Purchase {
  @Prop({ required: true, unique: true })
  orderId: string; // Custom Order ID (e.g., ORD-001)

@Prop({ type: Types.ObjectId, ref:Supplier.name, required: true })
supplier: Types.ObjectId;



  @Prop({ type: Date, default: Date.now })
  date: Date; // Order placed date

  @Prop({
    type: [
      {
        product: { type: Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    required: true,
  })
  items: {
    product: Types.ObjectId;
    quantity: number;
    price: number;
  }[];

  @Prop({ required: true, min: 0 })
  total: number; // Total price

  @Prop({ type: Date })
  expectedDelivery: Date; // Expected delivery date

   @Prop({
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;
  @Prop({ type: Number, default: 0 })
payAmount: number;
}

export const PurchaseSchema  = SchemaFactory.createForClass(Purchase);

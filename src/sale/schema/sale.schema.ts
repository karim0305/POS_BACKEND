import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { SaleStatus } from '../enum/sale.enum';
import { ApiProperty } from '@nestjs/swagger';

export type SaleDocument = Sale & Document;

@Schema({ timestamps: true })
export class Sale {
  @ApiProperty({ description: 'Unique invoice number', example: 'SALE-001' })
  @Prop({ required: true, unique: true })
  Invoice: string;

  @ApiProperty({ description: 'Customer name', example: 'John Doe' })
  @Prop({ type:  mongoose.Schema.Types.Mixed, required: true })
  customer: string | mongoose.Types.ObjectId;

  @ApiProperty({ description: 'Sale date', example: '2025-09-08T00:00:00.000Z' })
  @Prop({ type: Date, default: Date.now })
  date: Date;

  @ApiProperty({
    description: 'Products sold',
    type: [Object],
    example: [
      { product: '64f1c0e1f2b3a2d1a0b0c0d1', quantity: 2, price: 25 },
    ],
  })
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

  @ApiProperty({ description: 'Total sale amount', example: 50 })
  @Prop({ required: true, min: 0 })
  total: number;

   @ApiProperty({ description: 'Pay amount', example: 50 })
  @Prop({ required: true, min: 0 })
  PayAmmount: number;

  @ApiProperty({ enum: SaleStatus, description: 'Sale status', example: SaleStatus.COMPLETED })
  @Prop({
    type: String,
    enum: Object.values(SaleStatus),
    default: SaleStatus.COMPLETED,
  })
  status: SaleStatus;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);

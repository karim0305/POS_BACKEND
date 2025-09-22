import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SupplierDocument = Supplier & Document;

@Schema({ timestamps: true })
export class Supplier {
  // Basic Info
  @Prop({ required: true })
  fullName: string;

  @Prop({ unique: true })
  cnic: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  email?: string;

  @Prop()
  address?: string;

  @Prop()
  companyName?: string;

  // Supply Details
  @Prop({ type: [String] })
  supplyItems: string[];

  @Prop({ default: 'Active', enum: ['Active', 'Inactive', 'Blocked'] })
  status: string;

  // Transactions aligned with TransactionDto
  @Prop([
    {
      OrderNo: { type: String, required: true }, // Unique number e.g. ORD-xxxx
      TransectionDate: { type: Date, required: true },
      AmountType: { type: String,  required: true },
      paidAmount: { type: Number, default: 0 },
    },
  ])
  transactions?: Record<string, any>[];

  // Other Useful Info
  @Prop()
  gstNumber?: string;

  @Prop()
  bankDetails?: string;
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type CustomerDocument = Customer & Document;

@Schema({ timestamps: true })
export class Customer {
  @Prop({ required: true })
  name: string; // Customer Name

  @Prop()
  contact: string; // Phone / Email

  @Prop()
  email: string; // Phone / Email

  @Prop({ type: String, enum: ["Regular", "Premium", "VIP"], default: "Regular" })
  customerType: string; // Customer Type

  // 👇 Instead of orders (ref: Order), keep sales history
  @Prop({
    type: [
      {
        // Reference to Sale
        invoiceNo: { type: String },
        AmmountType: { type: String},
        status: { type: String,default: "COMPLETED"},
        paidAmount: { type: Number, default: 0 },
        date: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  salestransection: {
    sale: Types.ObjectId;
    invoiceNo: string;
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    status: string;
    date: Date;
  }[];

  @Prop({ type: Number, default: 0 })
  totalSpent: number; // Total money spent

  @Prop({ type: Number, default: 0 })
  loyaltyPoints: number; // Loyalty Points

  @Prop({ type: String, enum: ["Bronze", "Silver", "Gold", "Platinum"], default: "Bronze" })
  tier: string; // Tier

  @Prop({ type: Date })
  lastPurchase: Date; // Last purchase date
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);


import { ProductCategory } from '../enum/product.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type ProductDocument = Product & Document

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  name: string

  @Prop({ required: true, unique: true, trim: true })
  sku: string

  @Prop({ required: true, enum: ProductCategory })
  category: ProductCategory;

  @Prop({ required: true, type: Number, min: 0 })
  price: number

  @Prop({ required: true, type: Number, min: 0 })
  stock: number

  @Prop({ type: String, default: '' })
  description: string

  @Prop({ type: String, unique: true, sparse: true })
  barcode?: string


  @Prop({ type: [String], default: [] })
  images: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product)


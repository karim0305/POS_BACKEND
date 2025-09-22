import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  Min,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsUrl,
} from 'class-validator';
import { ProductCategory } from '../enum/product.enum';

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 16 Pro', description: 'Product name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'SKU-12345', description: 'Unique SKU code' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({
    enum: ProductCategory,
    example: ProductCategory.BEVERAGE,
    description: 'Product category',
  })
  @IsEnum(ProductCategory)
  category: ProductCategory;

  @ApiProperty({ example: 999.99, description: 'Product price' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 50, description: 'Available stock quantity' })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({ example: 'Latest Apple smartphone', description: 'Product description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '1234567890123', description: 'Barcode (unique)' })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiPropertyOptional({
    example: ['https://example.com/image1.png', 'https://example.com/image2.png'],
    description: 'Array of product image URLs',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}


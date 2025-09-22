import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, IsNumber, IsOptional, ValidateIf, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { SaleStatus } from '../enum/sale.enum';

class SaleItemDto {
  @ApiProperty({ description: 'Product ID', example: '64f1c0e1f2b3a2d1a0b0c0d1' })
  @IsString()
  @IsNotEmpty()
  product: Types.ObjectId | string;

  @ApiProperty({ description: 'Quantity sold', example: 2 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'Price per item', example: 25 })
  @IsNumber()
  price: number;
}

export class CreateSaleDto {
  @ApiProperty({ description: 'Unique invoice number', example: 'SALE-001' })
  @IsString()
  @IsNotEmpty()
  Invoice: string;

 @ApiProperty({
    description: "Customer ID (for registered) OR 'Walk-in Customer' as string",
    example: "68c6a06f0c8b5a6e71a2782f",
  })
  @ValidateIf((o) => o.customer !== "Walk-in Customer") // agar walk-in nahi hai to ID validate kare
  @IsMongoId()
  @IsOptional()
  customer: string;

  @ApiProperty({ description: 'Sale date', example: '2025-09-08T00:00:00.000Z', required: false })
  @IsOptional()
  date?: Date;

  @ApiProperty({ description: 'Products sold', type: [SaleItemDto] })
  @IsArray()
  items: SaleItemDto[];

  @ApiProperty({ description: 'Total sale amount', example: 50 })
  @IsNumber()
  total: number;


   @ApiProperty({ description: 'pay amount', example: 50 })
  @IsNumber()
  PayAmmount: number;

  @ApiProperty({ enum: SaleStatus, description: 'Sale status', example: SaleStatus.COMPLETED, required: false })
  @IsOptional()
  status?: SaleStatus;
}

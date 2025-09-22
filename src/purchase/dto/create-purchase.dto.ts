import { Type } from 'class-transformer';
import { 
  IsArray, 
  IsDate, 
  IsEnum, 
  IsMongoId, 
  IsNotEmpty, 
  IsNumber, 
  IsOptional, 
  IsString, 
  Min, 
  ValidateNested 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '../enum/purchase.enum';

class OrderItemDto {
  @ApiProperty({ example: '64f12ab3cd9e4f001234abcd', description: 'Product ID (Mongo ObjectId)' })
  @IsMongoId()
  @IsNotEmpty()
  product: string;

  @ApiProperty({ example: 2, minimum: 1, description: 'Quantity of product' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 500, minimum: 0, description: 'Price per product item' })
  @IsNumber()
  @Min(0)
  price: number;
}

export class CreatePurchaseDto {
  @ApiProperty({ example: 'ORD-001', description: 'Custom Order ID' })
  @IsString()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({ example: '64f12ab3cd9e4f001234abcd', description: 'Supplier ID (Mongo ObjectId)' })
  @IsMongoId()
  @IsNotEmpty()
  supplier: string;

  @ApiPropertyOptional({ example: '2025-09-07T12:00:00.000Z', description: 'Order placement date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @ApiProperty({ type: [OrderItemDto], description: 'List of order items' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ example: 1000, minimum: 0, description: 'Total order amount' })
  @IsNumber()
  @Min(0)
  total: number;
  @ApiProperty({ example: 300, description: "Amount paid at order time" })
  @IsNumber()
  @Min(0)
  payAmount: number; 

  @ApiPropertyOptional({ example: '2025-09-20T12:00:00.000Z', description: 'Expected delivery date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expectedDelivery?: Date;

  @ApiPropertyOptional({ enum: OrderStatus, example: OrderStatus.PENDING, description: 'Current order status' })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}

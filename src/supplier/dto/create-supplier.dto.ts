import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsEmail, IsOptional, IsArray, IsEnum, IsNumber, IsPositive, IsMongoId, IsDateString, ValidateNested } from 'class-validator';
export class TransactionDto {

  
  
  @ApiProperty({ example: 'ORD-1757698160412' })
  @IsString()
  OrderNo: string;// Purchase ki ObjectId

  @ApiProperty({
    description: 'Date of the order',
    example: '2025-09-12T13:23:06.246Z',
  })
  @IsDateString()
  TransectionDate: string; // ISO date string

  @ApiProperty({
    description: 'why Ammount Pay',
    example: 'cash, by hand, bill, check',
  })
  @IsNumber()
  AmountType: string;

  @ApiPropertyOptional({
    description: 'Amount paid',
    example: 1500,
  })
  @IsOptional()
  @IsNumber()
  paidAmount?: number;
}
export class CreateSupplierDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the supplier' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: '12345-6789012-3', description: 'Unique CNIC number' })
  @IsString()
  cnic: string;

  @ApiProperty({ example: '+92-300-1234567', description: 'Supplier phone number' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'supplier@example.com', description: 'Email address of supplier', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '123 Main Street, Karachi', description: 'Supplier address', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'ABC Traders', description: 'Company name', required: false })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({ example: ['Cement', 'Bricks'], description: 'List of supply items' })
  @IsArray()
  @IsString({ each: true })
  supplyItems: string[];

  @ApiProperty({ example: 'Active', enum: ['Active', 'Inactive', 'Blocked'], default: 'Active' })
  @IsEnum(['Active', 'Inactive', 'Blocked'])
  status: string;

  @ApiPropertyOptional({
    description: 'List of transactions related to this supplier',
    type: [TransactionDto],  // <-- Important: Swagger ko nested DTO array dikhane ke liye
    example: [
      {
        orderId: "68c41f3c465b8b6ea8f04860",
        orderDate: "2025-09-12T13:23:06.246Z",
        totalAmount: 4000,
        paidAmount: 1500,
        remainingAmount: 2500
      }
    ]
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransactionDto)
  transactions?: TransactionDto[];
  // Other Info
  @ApiProperty({ example: '07XXXXXXXXXX', description: 'GST number if registered', required: false })
  @IsOptional()
  @IsString()
  gstNumber?: string;

  @ApiProperty({ example: 'HBL Bank - 1234567890', description: 'Bank details', required: false })
  @IsOptional()
  @IsString()
  bankDetails?: string;
}

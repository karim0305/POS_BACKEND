import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsNumber,
  IsDate,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class SaleDto {
  @ApiProperty({ example: "INV-12345", description: "Invoice number of the sale" })
  @IsString()
  invoiceNo: string;

  @ApiProperty({ example: "Cash", description: "Payment type (Cash, Card, Bank etc.)" })
  @IsString()
  AmmountType: string;


    @ApiProperty({ example: "COMPLETED", description: "Status can be changed by Refund" })
  @IsString()
  status: string;

  @ApiProperty({ example: 500, description: "Paid amount for the invoice" })
  @IsNumber()
  paidAmount: number;

  @ApiProperty({ example: "2025-09-14T10:00:00.000Z", description: "Date of sale" })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;
}

export class CreateCustomerDto {
  @ApiProperty({ example: "Ali Khan", description: "Customer full name" })
  @IsString()
  name: string;

  @ApiProperty({ example: "03001234567", description: "Customer contact (phone/email)" })
  @IsOptional()
  @IsString()
  contact?: string;


   @ApiProperty({ example: "abc@gmail.com", description: "Customer contact (email)" })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    example: "Regular",
    enum: ["Regular", "Premium", "VIP"],
    description: "Customer type",
    default: "Regular",
  })
  @IsOptional()
  @IsEnum(["Regular", "Premium", "VIP"])
  customerType?: string;

  @ApiProperty({ type: [SaleDto], description: "Sales history of customer" })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleDto)
  salestransection?: SaleDto[];

  @ApiProperty({ example: 1000, description: "Total money spent by customer" })
  @IsOptional()
  @IsNumber()
  totalSpent?: number;

  @ApiProperty({ example: 50, description: "Customer loyalty points" })
  @IsOptional()
  @IsNumber()
  loyaltyPoints?: number;

  @ApiProperty({
    example: "Bronze",
    enum: ["Bronze", "Silver", "Gold", "Platinum"],
    description: "Customer tier",
    default: "Bronze",
  })
  @IsOptional()
  @IsEnum(["Bronze", "Silver", "Gold", "Platinum"])
  tier?: string;

  @ApiProperty({
    example: "2025-09-14T10:00:00.000Z",
    description: "Last purchase date",
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastPurchase?: Date;
}

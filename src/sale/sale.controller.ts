import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { SalesService } from '../sale/sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Sale } from '../sale/schema/sale.schema';

@ApiTags('Sales')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

@Post()
async create(
  @Body() createSaleDto: CreateSaleDto,
): Promise<{ success: boolean; message: string; data?: Sale }> {
  return this.salesService.create(createSaleDto);
}

  @Get()
  @ApiOperation({ summary: 'Get all sales' })
  @ApiResponse({ status: 200, description: 'List of sales', type: [Sale] })
  async findAll(): Promise<Sale[]> {
    return this.salesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a sale by ID' })
  @ApiResponse({ status: 200, description: 'Sale details', type: Sale })
  async findOne(@Param('id') id: string): Promise<Sale> {
    return this.salesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a sale by ID' })
  @ApiResponse({ status: 200, description: 'Sale updated', type: Sale })
  async update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto): Promise<Sale> {
    return this.salesService.update(id, updateSaleDto);
  }

  @Patch(':id/refund')
@ApiOperation({ summary: 'Refund a sale by ID' })
@ApiResponse({ status: 200, description: 'Sale refunded' })
async refundSale(@Param('id') id: string): Promise<{ success: boolean; message: string; data?: Sale }> {
  return this.salesService.refund(id);
}

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a sale by ID' })
  @ApiResponse({ status: 200, description: 'Sale deleted' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.salesService.remove(id);
  }
}

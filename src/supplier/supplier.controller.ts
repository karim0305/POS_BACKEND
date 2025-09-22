import { Controller, Get, Post, Body, Param, Delete, Put, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SupplierService } from './supplier.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';

@ApiTags('Suppliers') // Swagger grouping
@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}


  // ✅ Create Supplier
  @Post()
  @ApiOperation({ summary: 'Create a new supplier' })
  @ApiResponse({ status: 201, description: 'Supplier created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.supplierService.create(createSupplierDto);
  }

  // ✅ Get All Suppliers
  @Get()
  @ApiOperation({ summary: 'Get all suppliers' })
  @ApiResponse({ status: 200, description: 'List of suppliers' })
  async findAll() {
    return this.supplierService.getAllSuppliersWithBalance();
  }

  // ✅ Get Single Supplier
  @Get(':id')
  @ApiOperation({ summary: 'Get supplier by ID' })
  @ApiResponse({ status: 200, description: 'Supplier found' })
  @ApiResponse({ status: 404, description: 'Supplier not found' })
  async findOne(@Param('id') id: string) {
    return this.supplierService.findOne(id);
  }

  // ✅ Update Supplier
  @Put(':id')
  @ApiOperation({ summary: 'Update supplier by ID' })
  @ApiResponse({ status: 200, description: 'Supplier updated successfully' })
  @ApiResponse({ status: 404, description: 'Supplier not found' })
  async update(@Param('id') id: string, @Body() updateSupplierDto: Partial<CreateSupplierDto>) {
    return this.supplierService.update(id, updateSupplierDto);
  }

  // ✅ Delete Supplier
  @Delete(':id')
  @ApiOperation({ summary: 'Delete supplier by ID' })
  @ApiResponse({ status: 200, description: 'Supplier deleted successfully' })
  @ApiResponse({ status: 404, description: 'Supplier not found' })
  async remove(@Param('id') id: string) {
    return this.supplierService.remove(id);
  }



 @Patch(':id/transactions')
  async addTransaction(
    @Param('id') id: string,
    @Body('transaction') transaction: any,
  ) {
    return this.supplierService.addTransaction(id, transaction);
  }
}

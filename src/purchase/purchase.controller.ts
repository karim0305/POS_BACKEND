import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { Purchase } from '../purchase/schema/purchase.schema';

@ApiTags('Purchases') // Swagger group
@Controller('purchases')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  // ✅ Create
  @Post()
  @ApiOperation({ summary: 'Create a new purchase' })
  @ApiResponse({
    status: 201,
    description: 'Purchase created successfully',
    type: Purchase,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Body() createPurchaseDto: CreatePurchaseDto) {
    return this.purchaseService.create(createPurchaseDto);
  }

  // ✅ Read All
  @Get()
  @ApiOperation({ summary: 'Get all purchases' })
  @ApiResponse({
    status: 200,
    description: 'List of purchases',
    type: [Purchase],
  })
  async findAll() {
    return this.purchaseService.findAll();
  }

  // ✅ Read One
  @Get(':id')
  @ApiOperation({ summary: 'Get purchase by ID' })
  @ApiParam({ name: 'id', description: 'Purchase ID (Mongo ObjectId)' })
  @ApiResponse({
    status: 200,
    description: 'Purchase found',
    type: Purchase,
  })
  @ApiResponse({ status: 404, description: 'Purchase not found' })
  async findOne(@Param('id') id: string) {
    return this.purchaseService.findOne(id);
  }

  // ✅ Update
  @Patch(':id')
  @ApiOperation({ summary: 'Update purchase by ID' })
  @ApiParam({ name: 'id', description: 'Purchase ID (Mongo ObjectId)' })
  @ApiResponse({
    status: 200,
    description: 'Purchase updated successfully',
    type: Purchase,
  })
  @ApiResponse({ status: 404, description: 'Purchase not found' })
  async update(
    @Param('id') id: string,
    @Body() updatePurchaseDto: UpdatePurchaseDto,
  ) {
    return this.purchaseService.update(id, updatePurchaseDto);
  }

  // ✅ Delete
  @Delete(':id')
  @ApiOperation({ summary: 'Delete purchase by ID' })
  @ApiParam({ name: 'id', description: 'Purchase ID (Mongo ObjectId)' })
  @ApiResponse({
    status: 200,
    description: 'Purchase deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Purchase not found' })
  async remove(@Param('id') id: string) {
    return this.purchaseService.remove(id);
  }
}

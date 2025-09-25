import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ProductsService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../../src/config/multer.config';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 10, multerConfig)) // max 10 files
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    // 👇 Cloudinary returns secure_url in `file.path`
    const imageUrls = files?.map((file) => (file as any).path) || [];

    return this.productsService.create({
      ...createProductDto,
      price: Number(createProductDto.price),
      stock: Number(createProductDto.stock),
      images: imageUrls,
    });
  }

  // ✅ Get All Products
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // ✅ Get One Product by ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  // ✅ Update Product by ID
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', 10, multerConfig))
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const price = updateProductDto.price ? Number(updateProductDto.price) : undefined;
    const stock = updateProductDto.stock ? Number(updateProductDto.stock) : undefined;

    const newImageUrls = files?.map((file) => (file as any).path) || [];

    return this.productsService.update(id, {
      ...updateProductDto,
      ...(price !== undefined && { price }),
      ...(stock !== undefined && { stock }),
      ...(newImageUrls.length > 0 && { images: newImageUrls }),
    });
  }

  // ✅ Delete Product by ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}

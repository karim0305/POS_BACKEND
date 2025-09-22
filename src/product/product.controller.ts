import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ProductsService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/multer.config';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}


  // ✅ Create Product
  @Post()
  @UseInterceptors(FilesInterceptor('images', 10, multerConfig)) // max 10 files
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const imageUrls = files?.map((file) => `/uploads/${file.filename}`) || [];

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

  // ✅ Get One Product by ID (string, not number)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  // ✅ Update Product by ID
 @Patch(':id')
@UseInterceptors(FilesInterceptor('images', 10, multerConfig)) // max 10 files
async update(
  @Param('id') id: string,
  @Body() updateProductDto: UpdateProductDto,
  @UploadedFiles() files: Express.Multer.File[],
) {
  // 👇 convert strings to numbers if coming from FormData
  const price = updateProductDto.price ? Number(updateProductDto.price) : undefined;
  const stock = updateProductDto.stock ? Number(updateProductDto.stock) : undefined;

  // 👇 handle new images if uploaded
  const newImageUrls = files?.map((file) => `/uploads/${file.filename}`) || [];

  return this.productsService.update(id, {
    ...updateProductDto,
    ...(price !== undefined && { price }),
    ...(stock !== undefined && { stock }),
    ...(newImageUrls.length > 0 && { images: newImageUrls }), // only replace if new files uploaded
  });
}


  // ✅ Delete Product by ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }



  
}

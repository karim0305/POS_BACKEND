import { ProductsService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto, files: Express.Multer.File[]): Promise<{
        success: boolean;
        message: string;
        data?: import("./schema/product.schema").Product;
    }>;
    findAll(): Promise<import("./schema/product.schema").Product[]>;
    findOne(id: string): Promise<import("./schema/product.schema").Product>;
    update(id: string, updateProductDto: UpdateProductDto, files: Express.Multer.File[]): Promise<{
        success: boolean;
        message: string;
        data?: import("./schema/product.schema").Product;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}

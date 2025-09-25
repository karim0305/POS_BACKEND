import { Model } from 'mongoose';
import { Product, ProductDocument } from '../product/schema/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PurchaseDocument } from 'src/purchase/schema/purchase.schema';
import { SaleDocument } from 'src/sale/schema/sale.schema';
export declare class ProductsService {
    private readonly productModel;
    private purchaseModel;
    private saleModel;
    constructor(productModel: Model<ProductDocument>, purchaseModel: Model<PurchaseDocument>, saleModel: Model<SaleDocument>);
    create(createProductDto: CreateProductDto): Promise<{
        success: boolean;
        message: string;
        data?: Product;
    }>;
    findAll(): Promise<Product[]>;
    findOne(id: string): Promise<Product>;
    update(id: string, updateProductDto: UpdateProductDto & {
        images?: string[];
    }): Promise<{
        success: boolean;
        message: string;
        data?: Product;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}

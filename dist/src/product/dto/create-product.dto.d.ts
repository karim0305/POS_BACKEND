import { ProductCategory } from '../enum/product.enum';
export declare class CreateProductDto {
    name: string;
    sku: string;
    category: ProductCategory;
    price: number;
    stock: number;
    description?: string;
    barcode?: string;
    images?: string[];
}

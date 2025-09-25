import { Model } from 'mongoose';
import { Purchase, PurchaseDocument } from '../purchase/schema/purchase.schema';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { ProductDocument } from 'src/product/schema/product.schema';
export declare class PurchaseService {
    private purchaseModel;
    private productModel;
    private readonly supplierModel;
    constructor(purchaseModel: Model<PurchaseDocument>, productModel: Model<ProductDocument>, supplierModel: Model<ProductDocument>);
    create(createPurchaseDto: CreatePurchaseDto): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, PurchaseDocument, {}, {}> & Purchase & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    findAll(): Promise<Purchase[]>;
    findOne(id: string): Promise<Purchase>;
    update(id: string, updatePurchaseDto: UpdatePurchaseDto): Promise<{
        success: boolean;
        message: string;
        data?: Purchase;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}

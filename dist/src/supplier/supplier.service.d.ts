import { Model } from 'mongoose';
import { Supplier, SupplierDocument } from './schema/supplier.schema';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { PurchaseDocument } from 'src/purchase/schema/purchase.schema';
export declare class SupplierService {
    private supplierModel;
    private purchaseModel;
    constructor(supplierModel: Model<SupplierDocument>, purchaseModel: Model<PurchaseDocument>);
    create(createSupplierDto: CreateSupplierDto): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, SupplierDocument, {}, {}> & Supplier & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    getAllSuppliersWithBalance(): Promise<{
        success: boolean;
        message: string;
        data: any[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, SupplierDocument, {}, {}> & Supplier & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    update(id: string, updateData: Partial<CreateSupplierDto>): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, SupplierDocument, {}, {}> & Supplier & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    addTransaction(id: string, transaction: any): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, SupplierDocument, {}, {}> & Supplier & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
}

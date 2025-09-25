import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { Purchase } from '../purchase/schema/purchase.schema';
export declare class PurchaseController {
    private readonly purchaseService;
    constructor(purchaseService: PurchaseService);
    create(createPurchaseDto: CreatePurchaseDto): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../purchase/schema/purchase.schema").PurchaseDocument, {}, {}> & Purchase & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
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

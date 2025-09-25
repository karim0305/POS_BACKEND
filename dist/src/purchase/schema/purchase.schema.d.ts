import { Document, Types } from 'mongoose';
import { OrderStatus } from '../enum/purchase.enum';
export type PurchaseDocument = Purchase & Document;
export declare class Purchase {
    orderId: string;
    supplier: Types.ObjectId;
    date: Date;
    items: {
        product: Types.ObjectId;
        quantity: number;
        price: number;
    }[];
    total: number;
    expectedDelivery: Date;
    status: OrderStatus;
    payAmount: number;
}
export declare const PurchaseSchema: import("mongoose").Schema<Purchase, import("mongoose").Model<Purchase, any, any, any, Document<unknown, any, Purchase, any, {}> & Purchase & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Purchase, Document<unknown, {}, import("mongoose").FlatRecord<Purchase>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Purchase> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;

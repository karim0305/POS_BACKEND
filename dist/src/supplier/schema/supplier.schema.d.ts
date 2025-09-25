import { Document, Types } from 'mongoose';
export type SupplierDocument = Supplier & Document;
export declare class Supplier {
    fullName: string;
    cnic: string;
    phone: string;
    email?: string;
    address?: string;
    companyName?: string;
    supplyItems: string[];
    status: string;
    transactions?: Record<string, any>[];
    gstNumber?: string;
    bankDetails?: string;
}
export declare const SupplierSchema: import("mongoose").Schema<Supplier, import("mongoose").Model<Supplier, any, any, any, Document<unknown, any, Supplier, any, {}> & Supplier & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Supplier, Document<unknown, {}, import("mongoose").FlatRecord<Supplier>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Supplier> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;

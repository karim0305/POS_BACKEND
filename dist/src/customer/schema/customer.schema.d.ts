import { Document, Types } from "mongoose";
export type CustomerDocument = Customer & Document;
export declare class Customer {
    name: string;
    contact: string;
    email: string;
    customerType: string;
    salestransection: {
        sale: Types.ObjectId;
        invoiceNo: string;
        totalAmount: number;
        paidAmount: number;
        remainingAmount: number;
        status: string;
        date: Date;
    }[];
    totalSpent: number;
    loyaltyPoints: number;
    tier: string;
    lastPurchase: Date;
}
export declare const CustomerSchema: import("mongoose").Schema<Customer, import("mongoose").Model<Customer, any, any, any, Document<unknown, any, Customer, any, {}> & Customer & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Customer, Document<unknown, {}, import("mongoose").FlatRecord<Customer>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Customer> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;

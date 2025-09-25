import mongoose, { Document, Types } from 'mongoose';
import { SaleStatus } from '../enum/sale.enum';
export type SaleDocument = Sale & Document;
export declare class Sale {
    Invoice: string;
    customer: string | mongoose.Types.ObjectId;
    date: Date;
    items: {
        product: Types.ObjectId;
        quantity: number;
        price: number;
    }[];
    total: number;
    PayAmmount: number;
    status: SaleStatus;
}
export declare const SaleSchema: mongoose.Schema<Sale, mongoose.Model<Sale, any, any, any, mongoose.Document<unknown, any, Sale, any, {}> & Sale & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Sale, mongoose.Document<unknown, {}, mongoose.FlatRecord<Sale>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<Sale> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;

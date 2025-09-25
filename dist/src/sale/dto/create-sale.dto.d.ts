import { Types } from 'mongoose';
import { SaleStatus } from '../enum/sale.enum';
declare class SaleItemDto {
    product: Types.ObjectId | string;
    quantity: number;
    price: number;
}
export declare class CreateSaleDto {
    Invoice: string;
    customer: string;
    date?: Date;
    items: SaleItemDto[];
    total: number;
    PayAmmount: number;
    status?: SaleStatus;
}
export {};

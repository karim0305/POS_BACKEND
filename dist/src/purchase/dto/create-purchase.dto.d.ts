import { OrderStatus } from '../enum/purchase.enum';
declare class OrderItemDto {
    product: string;
    quantity: number;
    price: number;
}
export declare class CreatePurchaseDto {
    orderId: string;
    supplier: string;
    date?: Date;
    items: OrderItemDto[];
    total: number;
    payAmount: number;
    expectedDelivery?: Date;
    status?: OrderStatus;
}
export {};

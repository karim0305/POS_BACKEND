declare class SaleDto {
    invoiceNo: string;
    AmmountType: string;
    status: string;
    paidAmount: number;
    date?: Date;
}
export declare class CreateCustomerDto {
    name: string;
    contact?: string;
    email?: string;
    customerType?: string;
    salestransection?: SaleDto[];
    totalSpent?: number;
    loyaltyPoints?: number;
    tier?: string;
    lastPurchase?: Date;
}
export {};

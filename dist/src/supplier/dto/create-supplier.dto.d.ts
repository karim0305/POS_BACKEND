export declare class TransactionDto {
    OrderNo: string;
    TransectionDate: string;
    AmountType: string;
    paidAmount?: number;
}
export declare class CreateSupplierDto {
    fullName: string;
    cnic: string;
    phone: string;
    email?: string;
    address?: string;
    companyName?: string;
    supplyItems: string[];
    status: string;
    transactions?: TransactionDto[];
    gstNumber?: string;
    bankDetails?: string;
}

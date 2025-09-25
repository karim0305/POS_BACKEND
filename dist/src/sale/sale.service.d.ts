import { Model } from 'mongoose';
import { Sale, SaleDocument } from '../sale/schema/sale.schema';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { ProductDocument } from '../product/schema/product.schema';
import { CustomerDocument } from 'src/customer/schema/customer.schema';
export declare class SalesService {
    private saleModel;
    private readonly productModel;
    private customerModel;
    constructor(saleModel: Model<SaleDocument>, productModel: Model<ProductDocument>, customerModel: Model<CustomerDocument>);
    create(createSaleDto: CreateSaleDto): Promise<{
        success: boolean;
        message: string;
        data?: Sale;
    }>;
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    remove(id: string): Promise<void>;
    refund(id: string): Promise<{
        success: boolean;
        message: string;
        data?: Sale;
    }>;
    getTodayStats(): Promise<{
        totalSales: any;
        avgSales: any;
        totalItems: any;
        invoices: any;
    }>;
    update(id: string, updateSaleDto: UpdateSaleDto): Promise<Sale>;
}

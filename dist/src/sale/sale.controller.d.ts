import { SalesService } from '../sale/sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale } from '../sale/schema/sale.schema';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    create(createSaleDto: CreateSaleDto): Promise<{
        success: boolean;
        message: string;
        data?: Sale;
    }>;
    findAll(): Promise<Sale[]>;
    getTodayStats(): Promise<{
        totalSales: any;
        avgSales: any;
        totalItems: any;
        invoices: any;
    }>;
    findOne(id: string): Promise<Sale>;
    update(id: string, updateSaleDto: UpdateSaleDto): Promise<Sale>;
    refundSale(id: string): Promise<{
        success: boolean;
        message: string;
        data?: Sale;
    }>;
    remove(id: string): Promise<void>;
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const sale_service_1 = require("./sale.service");
const sale_controller_1 = require("./sale.controller");
const sale_schema_1 = require("../sale/schema/sale.schema");
const product_schema_1 = require("../product/schema/product.schema");
const customer_module_1 = require("../customer/customer.module");
let SaleModule = class SaleModule {
};
exports.SaleModule = SaleModule;
exports.SaleModule = SaleModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: sale_schema_1.Sale.name, schema: sale_schema_1.SaleSchema },
                { name: product_schema_1.Product.name, schema: product_schema_1.ProductSchema },]),
            customer_module_1.CustomerModule,
        ],
        controllers: [sale_controller_1.SalesController],
        providers: [sale_service_1.SalesService],
        exports: [sale_service_1.SalesService],
    })
], SaleModule);
//# sourceMappingURL=sale.module.js.map
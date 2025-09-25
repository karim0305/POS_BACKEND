"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const product_service_1 = require("./product.service");
const product_controller_1 = require("./product.controller");
const product_schema_1 = require("../product/schema/product.schema");
const purchase_schema_1 = require("../purchase/schema/purchase.schema");
const sale_schema_1 = require("../sale/schema/sale.schema");
let ProductsModule = class ProductsModule {
};
exports.ProductsModule = ProductsModule;
exports.ProductsModule = ProductsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: product_schema_1.Product.name, schema: product_schema_1.ProductSchema },
                { name: purchase_schema_1.Purchase.name, schema: purchase_schema_1.PurchaseSchema },
                { name: sale_schema_1.Sale.name, schema: sale_schema_1.SaleSchema },]),
        ],
        controllers: [product_controller_1.ProductsController],
        providers: [product_service_1.ProductsService],
        exports: [product_service_1.ProductsService, mongoose_1.MongooseModule],
    })
], ProductsModule);
//# sourceMappingURL=product.module.js.map
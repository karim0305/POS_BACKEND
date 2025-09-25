"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const supplier_service_1 = require("./supplier.service");
const supplier_controller_1 = require("./supplier.controller");
const supplier_schema_1 = require("./schema/supplier.schema");
const purchase_schema_1 = require("../purchase/schema/purchase.schema");
let SupplierModule = class SupplierModule {
};
exports.SupplierModule = SupplierModule;
exports.SupplierModule = SupplierModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: supplier_schema_1.Supplier.name, schema: supplier_schema_1.SupplierSchema },
                { name: purchase_schema_1.Purchase.name, schema: purchase_schema_1.PurchaseSchema },
            ]),
        ],
        controllers: [supplier_controller_1.SupplierController],
        providers: [supplier_service_1.SupplierService],
        exports: [supplier_service_1.SupplierService],
    })
], SupplierModule);
//# sourceMappingURL=supplier.module.js.map
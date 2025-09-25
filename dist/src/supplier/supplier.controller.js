"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const supplier_service_1 = require("./supplier.service");
const create_supplier_dto_1 = require("./dto/create-supplier.dto");
let SupplierController = class SupplierController {
    supplierService;
    constructor(supplierService) {
        this.supplierService = supplierService;
    }
    async create(createSupplierDto) {
        return this.supplierService.create(createSupplierDto);
    }
    async findAll() {
        return this.supplierService.getAllSuppliersWithBalance();
    }
    async findOne(id) {
        return this.supplierService.findOne(id);
    }
    async update(id, updateSupplierDto) {
        return this.supplierService.update(id, updateSupplierDto);
    }
    async remove(id) {
        return this.supplierService.remove(id);
    }
    async addTransaction(id, transaction) {
        return this.supplierService.addTransaction(id, transaction);
    }
};
exports.SupplierController = SupplierController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new supplier' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Supplier created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_supplier_dto_1.CreateSupplierDto]),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all suppliers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of suppliers' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get supplier by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Supplier found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Supplier not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update supplier by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Supplier updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Supplier not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete supplier by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Supplier deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Supplier not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/transactions'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('transaction')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SupplierController.prototype, "addTransaction", null);
exports.SupplierController = SupplierController = __decorate([
    (0, swagger_1.ApiTags)('Suppliers'),
    (0, common_1.Controller)('suppliers'),
    __metadata("design:paramtypes", [supplier_service_1.SupplierService])
], SupplierController);
//# sourceMappingURL=supplier.controller.js.map
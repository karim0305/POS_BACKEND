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
exports.PurchaseController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const purchase_service_1 = require("./purchase.service");
const create_purchase_dto_1 = require("./dto/create-purchase.dto");
const update_purchase_dto_1 = require("./dto/update-purchase.dto");
const purchase_schema_1 = require("../purchase/schema/purchase.schema");
let PurchaseController = class PurchaseController {
    purchaseService;
    constructor(purchaseService) {
        this.purchaseService = purchaseService;
    }
    async create(createPurchaseDto) {
        return this.purchaseService.create(createPurchaseDto);
    }
    async findAll() {
        return this.purchaseService.findAll();
    }
    async findOne(id) {
        return this.purchaseService.findOne(id);
    }
    async update(id, updatePurchaseDto) {
        return this.purchaseService.update(id, updatePurchaseDto);
    }
    async remove(id) {
        return this.purchaseService.remove(id);
    }
};
exports.PurchaseController = PurchaseController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new purchase' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Purchase created successfully',
        type: purchase_schema_1.Purchase,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_purchase_dto_1.CreatePurchaseDto]),
    __metadata("design:returntype", Promise)
], PurchaseController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all purchases' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of purchases',
        type: [purchase_schema_1.Purchase],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PurchaseController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get purchase by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Purchase ID (Mongo ObjectId)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Purchase found',
        type: purchase_schema_1.Purchase,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Purchase not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PurchaseController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update purchase by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Purchase ID (Mongo ObjectId)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Purchase updated successfully',
        type: purchase_schema_1.Purchase,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Purchase not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_purchase_dto_1.UpdatePurchaseDto]),
    __metadata("design:returntype", Promise)
], PurchaseController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete purchase by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Purchase ID (Mongo ObjectId)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Purchase deleted successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Purchase not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PurchaseController.prototype, "remove", null);
exports.PurchaseController = PurchaseController = __decorate([
    (0, swagger_1.ApiTags)('Purchases'),
    (0, common_1.Controller)('purchases'),
    __metadata("design:paramtypes", [purchase_service_1.PurchaseService])
], PurchaseController);
//# sourceMappingURL=purchase.controller.js.map
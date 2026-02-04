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
exports.BrandsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const brands_service_1 = require("./brands.service");
const create_brand_dto_1 = require("./dto/create-brand.dto");
const update_brand_dto_1 = require("./dto/update-brand.dto");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const decorators_1 = require("../common/decorators");
let BrandsController = class BrandsController {
    constructor(brandsService) {
        this.brandsService = brandsService;
    }
    async findAll(query) {
        return this.brandsService.findAll(query);
    }
    async findOne(id) {
        return this.brandsService.findOne(id);
    }
    async create(createBrandDto) {
        return this.brandsService.create(createBrandDto);
    }
    async update(id, updateBrandDto) {
        return this.brandsService.update(id, updateBrandDto);
    }
    async remove(id) {
        return this.brandsService.remove(id);
    }
};
exports.BrandsController = BrandsController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Permissions)('brands'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all brands' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, decorators_1.Permissions)('brands'),
    (0, swagger_1.ApiOperation)({ summary: 'Get brand by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Permissions)('add_brand'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new brand' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_brand_dto_1.CreateBrandDto]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, decorators_1.Permissions)('edit_brand'),
    (0, swagger_1.ApiOperation)({ summary: 'Update brand' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_brand_dto_1.UpdateBrandDto]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.Permissions)('delete_brand'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete brand (soft delete)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrandsController.prototype, "remove", null);
exports.BrandsController = BrandsController = __decorate([
    (0, swagger_1.ApiTags)('Brands'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('brands'),
    __metadata("design:paramtypes", [brands_service_1.BrandsService])
], BrandsController);
//# sourceMappingURL=brands.controller.js.map
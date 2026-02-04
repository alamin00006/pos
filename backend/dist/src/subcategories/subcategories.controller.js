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
exports.SubcategoriesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const subcategories_service_1 = require("./subcategories.service");
const create_subcategory_dto_1 = require("./dto/create-subcategory.dto");
const update_subcategory_dto_1 = require("./dto/update-subcategory.dto");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const decorators_1 = require("../common/decorators");
let SubcategoriesController = class SubcategoriesController {
    constructor(subcategoriesService) {
        this.subcategoriesService = subcategoriesService;
    }
    async findAll(query) {
        return this.subcategoriesService.findAll(query);
    }
    async findByCategory(categoryId) {
        return this.subcategoriesService.findByCategory(categoryId);
    }
    async findOne(id) {
        return this.subcategoriesService.findOne(id);
    }
    async create(createSubcategoryDto) {
        return this.subcategoriesService.create(createSubcategoryDto);
    }
    async update(id, updateSubcategoryDto) {
        return this.subcategoriesService.update(id, updateSubcategoryDto);
    }
    async remove(id) {
        return this.subcategoriesService.remove(id);
    }
};
exports.SubcategoriesController = SubcategoriesController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Permissions)('create_category'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all subcategories' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], SubcategoriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('by-category/:categoryId'),
    (0, decorators_1.Permissions)('create_category'),
    (0, swagger_1.ApiOperation)({ summary: 'Get subcategories by category ID' }),
    __param(0, (0, common_1.Param)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubcategoriesController.prototype, "findByCategory", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, decorators_1.Permissions)('create_category'),
    (0, swagger_1.ApiOperation)({ summary: 'Get subcategory by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubcategoriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Permissions)('add_category', 'create_category'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new subcategory' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_subcategory_dto_1.CreateSubcategoryDto]),
    __metadata("design:returntype", Promise)
], SubcategoriesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, decorators_1.Permissions)('edit_category'),
    (0, swagger_1.ApiOperation)({ summary: 'Update subcategory' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_subcategory_dto_1.UpdateSubcategoryDto]),
    __metadata("design:returntype", Promise)
], SubcategoriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.Permissions)('delete_category'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete subcategory (soft delete)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SubcategoriesController.prototype, "remove", null);
exports.SubcategoriesController = SubcategoriesController = __decorate([
    (0, swagger_1.ApiTags)('Subcategories'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('subcategories'),
    __metadata("design:paramtypes", [subcategories_service_1.SubcategoriesService])
], SubcategoriesController);
//# sourceMappingURL=subcategories.controller.js.map
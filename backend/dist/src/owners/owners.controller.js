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
exports.OwnersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const owners_service_1 = require("./owners.service");
const create_owner_dto_1 = require("./dto/create-owner.dto");
const update_owner_dto_1 = require("./dto/update-owner.dto");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const decorators_1 = require("../common/decorators");
let OwnersController = class OwnersController {
    constructor(ownersService) {
        this.ownersService = ownersService;
    }
    async findAll(query) {
        return this.ownersService.findAll(query);
    }
    async findOne(id) {
        return this.ownersService.findOne(id);
    }
    async create(createOwnerDto) {
        return this.ownersService.create(createOwnerDto);
    }
    async update(id, updateOwnerDto) {
        return this.ownersService.update(id, updateOwnerDto);
    }
    async remove(id) {
        return this.ownersService.remove(id);
    }
};
exports.OwnersController = OwnersController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Permissions)('owner_list'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all owners' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], OwnersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, decorators_1.Permissions)('owner_list'),
    (0, swagger_1.ApiOperation)({ summary: 'Get owner by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OwnersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Permissions)('add_owner'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new owner' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_owner_dto_1.CreateOwnerDto]),
    __metadata("design:returntype", Promise)
], OwnersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, decorators_1.Permissions)('edit_owner'),
    (0, swagger_1.ApiOperation)({ summary: 'Update owner' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_owner_dto_1.UpdateOwnerDto]),
    __metadata("design:returntype", Promise)
], OwnersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.Permissions)('delete_owner'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete owner (soft delete)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OwnersController.prototype, "remove", null);
exports.OwnersController = OwnersController = __decorate([
    (0, swagger_1.ApiTags)('Owners'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('owners'),
    __metadata("design:paramtypes", [owners_service_1.OwnersService])
], OwnersController);
//# sourceMappingURL=owners.controller.js.map
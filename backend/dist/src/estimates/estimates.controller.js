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
exports.EstimatesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const estimates_service_1 = require("./estimates.service");
const decorators_1 = require("../common/decorators");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const dto_1 = require("./dto");
let EstimatesController = class EstimatesController {
    constructor(service) {
        this.service = service;
    }
    create(dto) {
        return this.service.create(dto);
    }
    findAll(query) {
        return this.service.findAll(query);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    remove(id) {
        return this.service.remove(id);
    }
};
exports.EstimatesController = EstimatesController;
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Permissions)('add_estimate'),
    (0, swagger_1.ApiOperation)({ summary: 'Create estimate' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateEstimateDto]),
    __metadata("design:returntype", void 0)
], EstimatesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Permissions)('view_estimate'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all estimates' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], EstimatesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, decorators_1.Permissions)('view_estimate'),
    (0, swagger_1.ApiOperation)({ summary: 'Get estimate by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EstimatesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, decorators_1.Permissions)('edit_estimate'),
    (0, swagger_1.ApiOperation)({ summary: 'Update estimate' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateEstimateDto]),
    __metadata("design:returntype", void 0)
], EstimatesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, decorators_1.Permissions)('delete_estimate'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete estimate' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EstimatesController.prototype, "remove", null);
exports.EstimatesController = EstimatesController = __decorate([
    (0, swagger_1.ApiTags)('Estimates'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('estimates'),
    __metadata("design:paramtypes", [estimates_service_1.EstimatesService])
], EstimatesController);
//# sourceMappingURL=estimates.controller.js.map
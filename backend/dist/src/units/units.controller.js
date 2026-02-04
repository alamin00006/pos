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
exports.UnitsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const units_service_1 = require("./units.service");
const create_unit_dto_1 = require("./dto/create-unit.dto");
const update_unit_dto_1 = require("./dto/update-unit.dto");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const decorators_1 = require("../common/decorators");
let UnitsController = class UnitsController {
    constructor(unitsService) {
        this.unitsService = unitsService;
    }
    async findAll(query) {
        return this.unitsService.findAll(query);
    }
    async findOne(id) {
        return this.unitsService.findOne(id);
    }
    async create(createUnitDto) {
        return this.unitsService.create(createUnitDto);
    }
    async update(id, updateUnitDto) {
        return this.unitsService.update(id, updateUnitDto);
    }
    async remove(id) {
        return this.unitsService.remove(id);
    }
};
exports.UnitsController = UnitsController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Permissions)('units'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all units' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], UnitsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, decorators_1.Permissions)('units'),
    (0, swagger_1.ApiOperation)({ summary: 'Get unit by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UnitsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Permissions)('add_unit'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new unit' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_unit_dto_1.CreateUnitDto]),
    __metadata("design:returntype", Promise)
], UnitsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, decorators_1.Permissions)('edit_unit'),
    (0, swagger_1.ApiOperation)({ summary: 'Update unit' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_unit_dto_1.UpdateUnitDto]),
    __metadata("design:returntype", Promise)
], UnitsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.Permissions)('edit_unit'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete unit (soft delete)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UnitsController.prototype, "remove", null);
exports.UnitsController = UnitsController = __decorate([
    (0, swagger_1.ApiTags)('Units'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('units'),
    __metadata("design:paramtypes", [units_service_1.UnitsService])
], UnitsController);
//# sourceMappingURL=units.controller.js.map
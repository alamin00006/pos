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
exports.RolesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const roles_service_1 = require("./roles.service");
const create_role_dto_1 = require("./dto/create-role.dto");
const update_role_dto_1 = require("./dto/update-role.dto");
const assign_permissions_dto_1 = require("./dto/assign-permissions.dto");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const decorators_1 = require("../common/decorators");
let RolesController = class RolesController {
    constructor(rolesService) {
        this.rolesService = rolesService;
    }
    async findAll(query) {
        return this.rolesService.findAll(query);
    }
    async findOne(id) {
        return this.rolesService.findOne(id);
    }
    async create(createRoleDto) {
        return this.rolesService.create(createRoleDto);
    }
    async update(id, updateRoleDto) {
        return this.rolesService.update(id, updateRoleDto);
    }
    async remove(id) {
        return this.rolesService.remove(id);
    }
    async assignPermissions(id, assignPermissionsDto) {
        return this.rolesService.assignPermissions(id, assignPermissionsDto.permissionIds);
    }
    async updatePermissions(id, assignPermissionsDto) {
        return this.rolesService.updatePermissions(id, assignPermissionsDto.permissionIds);
    }
};
exports.RolesController = RolesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all roles' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get role by ID with permissions' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Permissions)('add_user'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new role' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_role_dto_1.CreateRoleDto]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, decorators_1.Permissions)('edit_user'),
    (0, swagger_1.ApiOperation)({ summary: 'Update role' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_role_dto_1.UpdateRoleDto]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.Permissions)('delete_user'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete role (soft delete)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/permissions'),
    (0, decorators_1.Permissions)('edit_user'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign permissions to role' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assign_permissions_dto_1.AssignPermissionsDto]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "assignPermissions", null);
__decorate([
    (0, common_1.Put)(':id/permissions'),
    (0, decorators_1.Permissions)('edit_user'),
    (0, swagger_1.ApiOperation)({ summary: 'Update role permissions (replace all)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assign_permissions_dto_1.AssignPermissionsDto]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "updatePermissions", null);
exports.RolesController = RolesController = __decorate([
    (0, swagger_1.ApiTags)('Roles'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('roles'),
    __metadata("design:paramtypes", [roles_service_1.RolesService])
], RolesController);
//# sourceMappingURL=roles.controller.js.map
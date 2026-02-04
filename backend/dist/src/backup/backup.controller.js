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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const backup_service_1 = require("./backup.service");
const decorators_1 = require("../common/decorators");
let BackupController = class BackupController {
    constructor(service) {
        this.service = service;
    }
    getBackupInfo() { return this.service.getBackupInfo(); }
};
exports.BackupController = BackupController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Permissions)('backup'),
    (0, swagger_1.ApiOperation)({ summary: 'Get backup information and instructions' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BackupController.prototype, "getBackupInfo", null);
exports.BackupController = BackupController = __decorate([
    (0, swagger_1.ApiTags)('Backup'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('backup'),
    __metadata("design:paramtypes", [backup_service_1.BackupService])
], BackupController);
//# sourceMappingURL=backup.controller.js.map
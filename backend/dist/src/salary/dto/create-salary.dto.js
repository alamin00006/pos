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
exports.CreateSalaryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateSalaryDto {
}
exports.CreateSalaryDto = CreateSalaryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateSalaryDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2024 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(2000),
    (0, class_validator_1.Max)(2100),
    __metadata("design:type", Number)
], CreateSalaryDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(12),
    __metadata("design:type", Number)
], CreateSalaryDto.prototype, "month", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateSalaryDto.prototype, "basicSalary", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 500 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateSalaryDto.prototype, "bonus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 200 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateSalaryDto.prototype, "overtime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateSalaryDto.prototype, "deductions", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 250 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateSalaryDto.prototype, "advance", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'cash' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['cash', 'bank', 'cheque']),
    __metadata("design:type", String)
], CreateSalaryDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateSalaryDto.prototype, "bankAccountId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'January salary payment' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSalaryDto.prototype, "notes", void 0);
//# sourceMappingURL=create-salary.dto.js.map
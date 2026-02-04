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
exports.CustomersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const customers_service_1 = require("./customers.service");
const create_customer_dto_1 = require("./dto/create-customer.dto");
const update_customer_dto_1 = require("./dto/update-customer.dto");
const customer_payment_dto_1 = require("./dto/customer-payment.dto");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const decorators_1 = require("../common/decorators");
let CustomersController = class CustomersController {
    constructor(customersService) {
        this.customersService = customersService;
    }
    async findAll(query) { return this.customersService.findAll(query); }
    async getDueReport(query) { return this.customersService.getDueReport(query); }
    async findOne(id) { return this.customersService.findOne(id); }
    async getLedger(id, query) { return this.customersService.getLedger(id, query); }
    async create(dto, userId) { return this.customersService.create(dto, userId); }
    async update(id, dto) { return this.customersService.update(id, dto); }
    async remove(id) { return this.customersService.remove(id); }
    async makePayment(id, dto) { return this.customersService.makePayment(id, dto); }
};
exports.CustomersController = CustomersController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Permissions)('create_customer'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all customers' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('due-report'),
    (0, decorators_1.Permissions)('customer_due_report'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customers with due amounts' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getDueReport", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, decorators_1.Permissions)('create_customer'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/ledger'),
    (0, decorators_1.Permissions)('customer_ledger', 'customer_ledger_report'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer ledger' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "getLedger", null);
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Permissions)('add_customer', 'create_customer', 'pos_add_customer'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new customer' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.CurrentUser)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_customer_dto_1.CreateCustomerDto, String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, decorators_1.Permissions)('edit_customer'),
    (0, swagger_1.ApiOperation)({ summary: 'Update customer' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_customer_dto_1.UpdateCustomerDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, decorators_1.Permissions)('delete_customer'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete customer' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/payment'),
    (0, decorators_1.Permissions)('customer_make_payment'),
    (0, swagger_1.ApiOperation)({ summary: 'Receive payment from customer' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, customer_payment_dto_1.CustomerPaymentDto]),
    __metadata("design:returntype", Promise)
], CustomersController.prototype, "makePayment", null);
exports.CustomersController = CustomersController = __decorate([
    (0, swagger_1.ApiTags)('Customers'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('customers'),
    __metadata("design:paramtypes", [customers_service_1.CustomersService])
], CustomersController);
//# sourceMappingURL=customers.controller.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOwnerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_owner_dto_1 = require("./create-owner.dto");
class UpdateOwnerDto extends (0, swagger_1.PartialType)(create_owner_dto_1.CreateOwnerDto) {
}
exports.UpdateOwnerDto = UpdateOwnerDto;
//# sourceMappingURL=update-owner.dto.js.map
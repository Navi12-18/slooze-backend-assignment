"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertCountryAccess = assertCountryAccess;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
function assertCountryAccess(user, resourceCountry) {
    if (user.role === client_1.Role.ADMIN) {
        return;
    }
    if (!user.country || user.country !== resourceCountry) {
        throw new common_1.ForbiddenException('This resource is outside your assigned country scope.');
    }
}
//# sourceMappingURL=country-access.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGraphqlEnums = registerGraphqlEnums;
const graphql_1 = require("@nestjs/graphql");
const client_1 = require("@prisma/client");
function registerGraphqlEnums() {
    (0, graphql_1.registerEnumType)(client_1.Role, { name: 'Role' });
    (0, graphql_1.registerEnumType)(client_1.Country, { name: 'Country' });
    (0, graphql_1.registerEnumType)(client_1.OrderStatus, { name: 'OrderStatus' });
}
//# sourceMappingURL=register-enums.js.map
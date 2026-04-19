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
exports.OrdersResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const orders_service_1 = require("./orders.service");
const order_model_1 = require("./models/order.model");
const add_to_cart_input_1 = require("./dto/add-to-cart.input");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
let OrdersResolver = class OrdersResolver {
    orders;
    constructor(orders) {
        this.orders = orders;
    }
    myOrders(user) {
        return this.orders.myOrders(user);
    }
    activeCart(user) {
        return this.orders.activeCart(user);
    }
    addToCart(user, input) {
        return this.orders.addToCart(user, input);
    }
    setCartLineQuantity(user, orderLineId, quantity) {
        return this.orders.setCartLineQuantity(user, orderLineId, quantity);
    }
    checkout(user, orderId, paymentMethodId) {
        return this.orders.checkout(user, orderId, paymentMethodId);
    }
    cancelOrder(user, orderId) {
        return this.orders.cancelOrder(user, orderId);
    }
};
exports.OrdersResolver = OrdersResolver;
__decorate([
    (0, graphql_1.Query)(() => [order_model_1.OrderModel]),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersResolver.prototype, "myOrders", null);
__decorate([
    (0, graphql_1.Query)(() => order_model_1.OrderModel, { nullable: true }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersResolver.prototype, "activeCart", null);
__decorate([
    (0, graphql_1.Mutation)(() => order_model_1.OrderModel),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, add_to_cart_input_1.AddToCartInput]),
    __metadata("design:returntype", Promise)
], OrdersResolver.prototype, "addToCart", null);
__decorate([
    (0, graphql_1.Mutation)(() => order_model_1.OrderModel),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('orderLineId', { type: () => graphql_1.ID })),
    __param(2, (0, graphql_1.Args)('quantity', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number]),
    __metadata("design:returntype", Promise)
], OrdersResolver.prototype, "setCartLineQuantity", null);
__decorate([
    (0, graphql_1.Mutation)(() => order_model_1.OrderModel),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.MANAGER),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('orderId', { type: () => graphql_1.ID })),
    __param(2, (0, graphql_1.Args)('paymentMethodId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], OrdersResolver.prototype, "checkout", null);
__decorate([
    (0, graphql_1.Mutation)(() => order_model_1.OrderModel),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.MANAGER),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('orderId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrdersResolver.prototype, "cancelOrder", null);
exports.OrdersResolver = OrdersResolver = __decorate([
    (0, graphql_1.Resolver)(() => order_model_1.OrderModel),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersResolver);
//# sourceMappingURL=orders.resolver.js.map
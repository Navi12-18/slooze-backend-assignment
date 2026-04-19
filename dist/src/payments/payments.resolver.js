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
exports.PaymentsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const payments_service_1 = require("./payments.service");
const payment_method_model_1 = require("./models/payment-method.model");
const create_payment_method_input_1 = require("./dto/create-payment-method.input");
const update_payment_method_input_1 = require("./dto/update-payment-method.input");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
let PaymentsResolver = class PaymentsResolver {
    payments;
    constructor(payments) {
        this.payments = payments;
    }
    paymentMethods(user, userId) {
        return this.payments.listForUser(user, userId);
    }
    createPaymentMethod(user, input) {
        return this.payments.create(user, input);
    }
    updatePaymentMethod(user, input) {
        return this.payments.update(user, input);
    }
    deletePaymentMethod(user, id) {
        return this.payments.remove(user, id);
    }
};
exports.PaymentsResolver = PaymentsResolver;
__decorate([
    (0, graphql_1.Query)(() => [payment_method_model_1.PaymentMethodModel]),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('userId', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PaymentsResolver.prototype, "paymentMethods", null);
__decorate([
    (0, graphql_1.Mutation)(() => payment_method_model_1.PaymentMethodModel),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_payment_method_input_1.CreatePaymentMethodInput]),
    __metadata("design:returntype", Promise)
], PaymentsResolver.prototype, "createPaymentMethod", null);
__decorate([
    (0, graphql_1.Mutation)(() => payment_method_model_1.PaymentMethodModel),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_payment_method_input_1.UpdatePaymentMethodInput]),
    __metadata("design:returntype", Promise)
], PaymentsResolver.prototype, "updatePaymentMethod", null);
__decorate([
    (0, graphql_1.Mutation)(() => Boolean),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PaymentsResolver.prototype, "deletePaymentMethod", null);
exports.PaymentsResolver = PaymentsResolver = __decorate([
    (0, graphql_1.Resolver)(() => payment_method_model_1.PaymentMethodModel),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsResolver);
//# sourceMappingURL=payments.resolver.js.map
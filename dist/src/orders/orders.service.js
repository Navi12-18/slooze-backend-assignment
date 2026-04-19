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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const country_access_1 = require("../common/scope/country-access");
const inc = { lines: { include: { menuItem: true } } };
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async myOrders(v) {
        const rows = await this.prisma.order.findMany({
            where: { userId: v.id },
            include: inc,
            orderBy: { updatedAt: 'desc' },
        });
        return rows.filter((o) => v.role === client_1.Role.ADMIN || (v.country && o.country === v.country));
    }
    async activeCart(v) {
        const cart = await this.prisma.order.findFirst({
            where: { userId: v.id, status: client_1.OrderStatus.CART },
            include: inc,
            orderBy: { updatedAt: 'desc' },
        });
        if (!cart)
            return null;
        (0, country_access_1.assertCountryAccess)(v, cart.country);
        return cart;
    }
    async addToCart(v, input) {
        const mi = await this.prisma.menuItem.findUnique({
            where: { id: input.menuItemId },
            include: { restaurant: true },
        });
        if (!mi || mi.restaurantId !== input.restaurantId) {
            throw new common_1.BadRequestException('Menu item does not belong to that restaurant.');
        }
        (0, country_access_1.assertCountryAccess)(v, mi.restaurant.country);
        const old = await this.prisma.order.findFirst({
            where: { userId: v.id, status: client_1.OrderStatus.CART },
        });
        if (old && old.restaurantId !== input.restaurantId) {
            await this.prisma.order.delete({ where: { id: old.id } });
        }
        let cart = await this.prisma.order.findFirst({
            where: { userId: v.id, status: client_1.OrderStatus.CART },
        });
        if (!cart) {
            cart = await this.prisma.order.create({
                data: {
                    userId: v.id,
                    restaurantId: input.restaurantId,
                    country: mi.restaurant.country,
                    status: client_1.OrderStatus.CART,
                },
            });
        }
        const line = await this.prisma.orderLine.findFirst({
            where: { orderId: cart.id, menuItemId: input.menuItemId },
        });
        if (line) {
            await this.prisma.orderLine.update({
                where: { id: line.id },
                data: { quantity: line.quantity + input.quantity },
            });
        }
        else {
            await this.prisma.orderLine.create({
                data: {
                    orderId: cart.id,
                    menuItemId: input.menuItemId,
                    quantity: input.quantity,
                    unitPriceCents: mi.priceCents,
                },
            });
        }
        const out = await this.prisma.order.findUniqueOrThrow({
            where: { id: cart.id },
            include: inc,
        });
        (0, country_access_1.assertCountryAccess)(v, out.country);
        return out;
    }
    async setCartLineQuantity(v, lineId, qty) {
        const line = await this.prisma.orderLine.findUnique({
            where: { id: lineId },
            include: { order: true },
        });
        if (!line || line.order.userId !== v.id)
            throw new common_1.NotFoundException('Cart line not found');
        if (line.order.status !== client_1.OrderStatus.CART) {
            throw new common_1.BadRequestException('Only open carts can be edited.');
        }
        (0, country_access_1.assertCountryAccess)(v, line.order.country);
        if (qty <= 0)
            await this.prisma.orderLine.delete({ where: { id: lineId } });
        else
            await this.prisma.orderLine.update({ where: { id: lineId }, data: { quantity: qty } });
        const order = await this.prisma.order.findUniqueOrThrow({
            where: { id: line.orderId },
            include: inc,
        });
        const n = await this.prisma.orderLine.count({ where: { orderId: order.id } });
        if (n === 0) {
            await this.prisma.order.delete({ where: { id: order.id } });
            throw new common_1.BadRequestException('Cart is now empty and was discarded.');
        }
        return order;
    }
    async checkout(v, orderId, paymentMethodId) {
        if (v.role === client_1.Role.MEMBER)
            throw new common_1.ForbiddenException('Members cannot checkout or pay.');
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.status !== client_1.OrderStatus.CART)
            throw new common_1.BadRequestException('Order is not an open cart.');
        (0, country_access_1.assertCountryAccess)(v, order.country);
        const pm = await this.prisma.paymentMethod.findUnique({ where: { id: paymentMethodId } });
        if (!pm || pm.userId !== order.userId) {
            throw new common_1.BadRequestException('Invalid payment method for this order.');
        }
        (0, country_access_1.assertCountryAccess)(v, pm.country);
        if (pm.country !== order.country) {
            throw new common_1.BadRequestException('Payment method country must match the order.');
        }
        const lc = await this.prisma.orderLine.count({ where: { orderId: order.id } });
        if (lc === 0)
            throw new common_1.BadRequestException('Cannot checkout an empty cart.');
        await this.prisma.order.update({ where: { id: order.id }, data: { status: client_1.OrderStatus.PLACED } });
        return this.prisma.order.findUniqueOrThrow({ where: { id: order.id }, include: inc });
    }
    async cancelOrder(v, orderId) {
        if (v.role === client_1.Role.MEMBER)
            throw new common_1.ForbiddenException('Members cannot cancel orders.');
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        if (order.status !== client_1.OrderStatus.PLACED) {
            throw new common_1.BadRequestException('Only placed orders can be cancelled.');
        }
        (0, country_access_1.assertCountryAccess)(v, order.country);
        await this.prisma.order.update({
            where: { id: order.id },
            data: { status: client_1.OrderStatus.CANCELLED },
        });
        return this.prisma.order.findUniqueOrThrow({ where: { id: order.id }, include: inc });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map
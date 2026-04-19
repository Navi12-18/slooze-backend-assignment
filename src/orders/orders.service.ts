import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderStatus, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { assertCountryAccess } from '../common/scope/country-access';
import type { AuthUser } from '../common/types/auth-user';
import type { OrderModel } from './models/order.model';

const inc = { lines: { include: { menuItem: true } } } as const;

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async myOrders(v: AuthUser): Promise<OrderModel[]> {
    const rows = await this.prisma.order.findMany({
      where: { userId: v.id },
      include: inc,
      orderBy: { updatedAt: 'desc' },
    });
    return rows.filter((o) => v.role === Role.ADMIN || (v.country && o.country === v.country));
  }

  async activeCart(v: AuthUser): Promise<OrderModel | null> {
    const cart = await this.prisma.order.findFirst({
      where: { userId: v.id, status: OrderStatus.CART },
      include: inc,
      orderBy: { updatedAt: 'desc' },
    });
    if (!cart) return null;
    assertCountryAccess(v, cart.country);
    return cart;
  }

  async addToCart(
    v: AuthUser,
    input: { restaurantId: string; menuItemId: string; quantity: number },
  ): Promise<OrderModel> {
    const mi = await this.prisma.menuItem.findUnique({
      where: { id: input.menuItemId },
      include: { restaurant: true },
    });
    if (!mi || mi.restaurantId !== input.restaurantId) {
      throw new BadRequestException('Menu item does not belong to that restaurant.');
    }
    assertCountryAccess(v, mi.restaurant.country);

    const old = await this.prisma.order.findFirst({
      where: { userId: v.id, status: OrderStatus.CART },
    });
    if (old && old.restaurantId !== input.restaurantId) {
      await this.prisma.order.delete({ where: { id: old.id } });
    }

    let cart = await this.prisma.order.findFirst({
      where: { userId: v.id, status: OrderStatus.CART },
    });
    if (!cart) {
      cart = await this.prisma.order.create({
        data: {
          userId: v.id,
          restaurantId: input.restaurantId,
          country: mi.restaurant.country,
          status: OrderStatus.CART,
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
    } else {
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
    assertCountryAccess(v, out.country);
    return out;
  }

  async setCartLineQuantity(v: AuthUser, lineId: string, qty: number): Promise<OrderModel> {
    const line = await this.prisma.orderLine.findUnique({
      where: { id: lineId },
      include: { order: true },
    });
    if (!line || line.order.userId !== v.id) throw new NotFoundException('Cart line not found');
    if (line.order.status !== OrderStatus.CART) {
      throw new BadRequestException('Only open carts can be edited.');
    }
    assertCountryAccess(v, line.order.country);
    if (qty <= 0) await this.prisma.orderLine.delete({ where: { id: lineId } });
    else await this.prisma.orderLine.update({ where: { id: lineId }, data: { quantity: qty } });
    const order = await this.prisma.order.findUniqueOrThrow({
      where: { id: line.orderId },
      include: inc,
    });
    const n = await this.prisma.orderLine.count({ where: { orderId: order.id } });
    if (n === 0) {
      await this.prisma.order.delete({ where: { id: order.id } });
      throw new BadRequestException('Cart is now empty and was discarded.');
    }
    return order;
  }

  async checkout(v: AuthUser, orderId: string, paymentMethodId: string): Promise<OrderModel> {
    if (v.role === Role.MEMBER) throw new ForbiddenException('Members cannot checkout or pay.');
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== OrderStatus.CART) throw new BadRequestException('Order is not an open cart.');
    assertCountryAccess(v, order.country);
    const pm = await this.prisma.paymentMethod.findUnique({ where: { id: paymentMethodId } });
    if (!pm || pm.userId !== order.userId) {
      throw new BadRequestException('Invalid payment method for this order.');
    }
    assertCountryAccess(v, pm.country);
    if (pm.country !== order.country) {
      throw new BadRequestException('Payment method country must match the order.');
    }
    const lc = await this.prisma.orderLine.count({ where: { orderId: order.id } });
    if (lc === 0) throw new BadRequestException('Cannot checkout an empty cart.');
    await this.prisma.order.update({ where: { id: order.id }, data: { status: OrderStatus.PLACED } });
    return this.prisma.order.findUniqueOrThrow({ where: { id: order.id }, include: inc });
  }

  async cancelOrder(v: AuthUser, orderId: string): Promise<OrderModel> {
    if (v.role === Role.MEMBER) throw new ForbiddenException('Members cannot cancel orders.');
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== OrderStatus.PLACED) {
      throw new BadRequestException('Only placed orders can be cancelled.');
    }
    assertCountryAccess(v, order.country);
    await this.prisma.order.update({
      where: { id: order.id },
      data: { status: OrderStatus.CANCELLED },
    });
    return this.prisma.order.findUniqueOrThrow({ where: { id: order.id }, include: inc });
  }
}

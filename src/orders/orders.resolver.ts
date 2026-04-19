import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { OrdersService } from './orders.service';
import { OrderModel } from './models/order.model';
import { AddToCartInput } from './dto/add-to-cart.input';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import type { AuthUser } from '../common/types/auth-user';

@Resolver(() => OrderModel)
export class OrdersResolver {
  constructor(private readonly orders: OrdersService) {}

  @Query(() => [OrderModel])
  myOrders(@CurrentUser() user: AuthUser): Promise<OrderModel[]> {
    return this.orders.myOrders(user);
  }

  @Query(() => OrderModel, { nullable: true })
  activeCart(@CurrentUser() user: AuthUser): Promise<OrderModel | null> {
    return this.orders.activeCart(user);
  }

  @Mutation(() => OrderModel)
  addToCart(@CurrentUser() user: AuthUser, @Args('input') input: AddToCartInput): Promise<OrderModel> {
    return this.orders.addToCart(user, input);
  }

  @Mutation(() => OrderModel)
  setCartLineQuantity(
    @CurrentUser() user: AuthUser,
    @Args('orderLineId', { type: () => ID }) orderLineId: string,
    @Args('quantity', { type: () => Int }) quantity: number,
  ): Promise<OrderModel> {
    return this.orders.setCartLineQuantity(user, orderLineId, quantity);
  }

  @Mutation(() => OrderModel)
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  checkout(
    @CurrentUser() user: AuthUser,
    @Args('orderId', { type: () => ID }) orderId: string,
    @Args('paymentMethodId', { type: () => ID }) paymentMethodId: string,
  ): Promise<OrderModel> {
    return this.orders.checkout(user, orderId, paymentMethodId);
  }

  @Mutation(() => OrderModel)
  @Roles(Role.ADMIN, Role.MANAGER)
  @UseGuards(RolesGuard)
  cancelOrder(
    @CurrentUser() user: AuthUser,
    @Args('orderId', { type: () => ID }) orderId: string,
  ): Promise<OrderModel> {
    return this.orders.cancelOrder(user, orderId);
  }
}

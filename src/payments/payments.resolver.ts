import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PaymentsService } from './payments.service';
import { PaymentMethodModel } from './models/payment-method.model';
import { CreatePaymentMethodInput } from './dto/create-payment-method.input';
import { UpdatePaymentMethodInput } from './dto/update-payment-method.input';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import type { AuthUser } from '../common/types/auth-user';

@Resolver(() => PaymentMethodModel)
export class PaymentsResolver {
  constructor(private readonly payments: PaymentsService) {}

  @Query(() => [PaymentMethodModel])
  paymentMethods(
    @CurrentUser() user: AuthUser,
    @Args('userId', { type: () => ID }) userId: string,
  ): Promise<PaymentMethodModel[]> {
    return this.payments.listForUser(user, userId);
  }

  @Mutation(() => PaymentMethodModel)
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  createPaymentMethod(
    @CurrentUser() user: AuthUser,
    @Args('input') input: CreatePaymentMethodInput,
  ): Promise<PaymentMethodModel> {
    return this.payments.create(user, input);
  }

  @Mutation(() => PaymentMethodModel)
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  updatePaymentMethod(
    @CurrentUser() user: AuthUser,
    @Args('input') input: UpdatePaymentMethodInput,
  ): Promise<PaymentMethodModel> {
    return this.payments.update(user, input);
  }

  @Mutation(() => Boolean)
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  deletePaymentMethod(
    @CurrentUser() user: AuthUser,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.payments.remove(user, id);
  }
}

import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Country, OrderStatus } from '@prisma/client';
import { OrderLineModel } from './order-line.model';

@ObjectType()
export class OrderModel {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  userId!: string;

  @Field(() => ID)
  restaurantId!: string;

  @Field(() => OrderStatus)
  status!: OrderStatus;

  @Field(() => Country)
  country!: Country;

  @Field(() => [OrderLineModel])
  lines!: OrderLineModel[];
}

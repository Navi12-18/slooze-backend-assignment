import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Country } from '@prisma/client';

@ObjectType()
export class PaymentMethodModel {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  userId!: string;

  @Field()
  label!: string;

  @Field()
  provider!: string;

  @Field()
  last4!: string;

  @Field()
  isDefault!: boolean;

  @Field(() => Country)
  country!: Country;
}

import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MenuItemModel {
  @Field(() => ID)
  id!: string;

  @Field()
  restaurantId!: string;

  @Field()
  name!: string;

  @Field(() => String, { nullable: true })
  description!: string | null;

  @Field(() => Number)
  priceCents!: number;

  @Field()
  currency!: string;
}

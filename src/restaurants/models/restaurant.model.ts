import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Country } from '@prisma/client';
import { MenuItemModel } from './menu-item.model';

@ObjectType()
export class RestaurantModel {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => Country)
  country!: Country;

  @Field()
  city!: string;

  @Field(() => String, { nullable: true })
  description!: string | null;

  @Field(() => [MenuItemModel])
  menuItems!: MenuItemModel[];
}

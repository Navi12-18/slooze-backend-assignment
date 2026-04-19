import { Field, ID, ObjectType } from '@nestjs/graphql';
import { MenuItemModel } from '../../restaurants/models/menu-item.model';

@ObjectType()
export class OrderLineModel {
  @Field(() => ID)
  id!: string;

  @Field(() => Number)
  quantity!: number;

  @Field(() => Number)
  unitPriceCents!: number;

  @Field(() => MenuItemModel)
  menuItem!: MenuItemModel;
}

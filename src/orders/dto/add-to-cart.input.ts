import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsUUID, Min } from 'class-validator';

@InputType()
export class AddToCartInput {
  @Field(() => ID)
  @IsUUID()
  restaurantId!: string;

  @Field(() => ID)
  @IsUUID()
  menuItemId!: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  quantity!: number;
}

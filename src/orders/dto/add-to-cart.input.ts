import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsString, Min, MinLength } from 'class-validator';

@InputType()
export class AddToCartInput {
  @Field(() => ID)
  @IsString()
  @MinLength(1)
  restaurantId!: string;

  @Field(() => ID)
  @IsString()
  @MinLength(1)
  menuItemId!: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  quantity!: number;
}

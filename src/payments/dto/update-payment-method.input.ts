import { Field, ID, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, Length, MinLength } from 'class-validator';

@InputType()
export class UpdatePaymentMethodInput {
  @Field(() => ID)
  @IsString()
  @MinLength(1)
  id!: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  label?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  provider?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(4, 4)
  last4?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

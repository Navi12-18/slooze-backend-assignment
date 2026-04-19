import { Field, ID, InputType } from '@nestjs/graphql';
import { Country } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional, IsString, Length, MinLength } from 'class-validator';

@InputType()
export class CreatePaymentMethodInput {
  @Field(() => ID)
  @IsString()
  @MinLength(1)
  userId!: string;

  @Field()
  @IsString()
  label!: string;

  @Field()
  @IsString()
  provider!: string;

  @Field()
  @IsString()
  @Length(4, 4)
  last4!: string;

  @Field(() => Country)
  @IsEnum(Country)
  country!: Country;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

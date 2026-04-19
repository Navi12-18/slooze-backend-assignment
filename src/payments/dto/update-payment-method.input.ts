import { Field, ID, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, IsUUID, Length } from 'class-validator';

@InputType()
export class UpdatePaymentMethodInput {
  @Field(() => ID)
  @IsUUID()
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

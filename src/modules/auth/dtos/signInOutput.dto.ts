import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@ObjectType()
export class SignInOutput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String, { nullable: true, defaultValue: null })
  token: string | null;

  @IsNotEmpty()
  @IsString()
  @Field(() => String, { nullable: true, defaultValue: null })
  refresh_token: string | null;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true, defaultValue: null })
  requiresTwoFactor: boolean | null;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true, defaultValue: null })
  twoFAToken: string | null;
}

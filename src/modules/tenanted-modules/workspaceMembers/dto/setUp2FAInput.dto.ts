import { Field, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class SetUp2FAInput {
  @IsNotEmpty()
  @Field(() => Number)
  @Type(() => Number)
  userId: number;

  @IsEnum(['googleAuthenticator'])
  @IsNotEmpty()
  @IsOptional()
  @Field(() => String)
  twoFAType: 'googleAuthenticator' = 'googleAuthenticator' as const;
}

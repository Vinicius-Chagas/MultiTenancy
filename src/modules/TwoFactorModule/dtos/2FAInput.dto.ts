import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class twoFAInput {
  @IsString()
  @IsNotEmpty()
  @Field()
  twoFAToken: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  authToken: string;
}

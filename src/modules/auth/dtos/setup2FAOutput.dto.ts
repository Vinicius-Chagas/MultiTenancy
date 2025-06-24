import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsString } from 'class-validator';

@ObjectType()
export class Setup2FAOutput {
  @IsString()
  @Field(() => String, { nullable: true })
  qrCodeUrl: string | null;

  @IsBoolean()
  @Field(() => Boolean)
  success: boolean;
}

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ValidateTokenOutput {
  @Field()
  isValid: boolean;

  @Field({ nullable: true, defaultValue: null })
  error?: string;
}

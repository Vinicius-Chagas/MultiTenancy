import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class SignInInput {
  @IsEmail({}, { message: 'Email inválido.' })
  @IsNotEmpty({ message: 'Email é obrigatório.' })
  @Field({ nullable: true })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Senha é obrigatório.' })
  @Field({ nullable: true })
  password: string;
}

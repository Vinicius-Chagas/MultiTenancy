import { InputType, PartialType } from '@nestjs/graphql';
import { CreateUserInput } from './createUserInput.dto';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {}

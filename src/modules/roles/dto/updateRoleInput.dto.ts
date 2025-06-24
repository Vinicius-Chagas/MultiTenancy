import { InputType, PartialType } from '@nestjs/graphql';
import { CreateRoleInput } from './createRoleInput';

@InputType()
export class UpdateRoleInput extends PartialType(CreateRoleInput) {}

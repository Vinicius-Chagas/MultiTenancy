import { InputType, PartialType } from '@nestjs/graphql';
import { CreatePermissionInput } from './createPermissionInput';

@InputType()
export class UpdatePermissionInput extends PartialType(CreatePermissionInput) {}

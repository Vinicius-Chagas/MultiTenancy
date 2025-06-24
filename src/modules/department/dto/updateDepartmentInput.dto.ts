import { InputType, PartialType } from '@nestjs/graphql';
import { CreateDepartmentInput } from './createDepartmentInput';

@InputType()
export class UpdateDepartmentInput extends PartialType(CreateDepartmentInput) {}

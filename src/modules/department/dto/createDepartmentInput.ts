import { InputType, OmitType } from '@nestjs/graphql';
import { Department } from '../department.entity';

@InputType()
export class CreateDepartmentInput extends OmitType(
  Department,
  ['id', 'createdAt', 'updatedAt', 'deletedAt'],
  InputType,
) {}

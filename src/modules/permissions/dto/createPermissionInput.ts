import { InputType, OmitType } from '@nestjs/graphql';
import { Permission } from '../permission.entity';

@InputType()
export class CreatePermissionInput extends OmitType(
  Permission,
  ['id', 'createdAt', 'updatedAt', 'deletedAt', 'roles'],
  InputType,
) {}

import { Field, InputType, OmitType } from '@nestjs/graphql';
import { Role } from '../role.entity';
import { IsArray, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateRoleInput extends OmitType(
  Role,
  ['id', 'createdAt', 'updatedAt', 'permissions', 'deletedAt', 'users'],
  InputType,
) {
  @Field(() => [Number])
  @IsArray()
  @IsNotEmpty()
  permissionsIds: number[];
}

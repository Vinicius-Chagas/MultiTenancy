import { InputType, OmitType } from '@nestjs/graphql';
import { Workspace } from '../workspace.entity';

@InputType()
export class CreateWorkspaceInput extends OmitType(
  Workspace,
  ['id', 'createdAt', 'updatedAt', 'company', 'deletedAt'],
  InputType,
) {}

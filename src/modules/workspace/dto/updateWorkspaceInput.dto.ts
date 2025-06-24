import { InputType, PartialType } from '@nestjs/graphql';
import { CreateWorkspaceInput } from './createWorkspaceInput';

@InputType()
export class UpdateWorkspaceInput extends PartialType(CreateWorkspaceInput) {}

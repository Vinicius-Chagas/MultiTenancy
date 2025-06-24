import { ObjectType } from '@nestjs/graphql';
import { PaginatedResponse } from 'src/shared/dto/paginationOutput.dto';
import { Workspace } from '../workspace.entity';

@ObjectType()
export class PagiantedWorkspaces extends PaginatedResponse(Workspace) {}

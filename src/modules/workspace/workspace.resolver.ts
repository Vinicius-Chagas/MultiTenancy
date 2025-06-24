import { Injectable } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { Args, Info, Int, Mutation, Query } from '@nestjs/graphql';
import { Workspace } from './workspace.entity';
import { GraphQLResolveInfo } from 'graphql';
import { UpdateWorkspaceInput } from './dto/updateWorkspaceInput.dto';
import { PaginationInput } from 'src/shared/dto/paginationInput.dto';
import { PagiantedWorkspaces } from './dto/paginatedWorkspaces.dto';

@Injectable()
export class WorkspaceResolver {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Query(() => PagiantedWorkspaces)
  async findAllWorkspaces(
    @Args('paginate') paginate: PaginationInput,
    @Info() info: GraphQLResolveInfo,
  ) {
    return await this.workspaceService.findAll(paginate, info);
  }

  @Query(() => Workspace)
  async findOneWorkspace(
    @Args('id', { type: () => Int }) id: number,
    @Info() info: GraphQLResolveInfo,
  ) {
    return await this.workspaceService.findOne(id, info);
  }

  @Mutation(() => Boolean)
  async updateWorkspace(
    @Args('id', { type: () => Int }) id: number,
    @Args('workspace', { type: () => UpdateWorkspaceInput }) workspace: UpdateWorkspaceInput,
  ) {
    await this.workspaceService.update(id, workspace);
    return true;
  }
}

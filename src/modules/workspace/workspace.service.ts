/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Workspace } from './workspace.entity';
import { BaseRepository } from 'src/database/base-repository';
import { QueryOptimizerService } from '../QueryOptimizer/queryoptimizer.service';
import { GraphQLResolveInfo } from 'graphql';
import { UpdateWorkspaceInput } from './dto/updateWorkspaceInput.dto';
import { PaginationInput } from 'src/shared/dto/paginationInput.dto';
import { CustomErrors } from 'src/shared/errors/customErrors';
import { PagiantedWorkspaces } from './dto/paginatedWorkspaces.dto';

@Injectable()
export class WorkspaceService {
  private errorHandler = new CustomErrors('workspace');
  constructor(
    @InjectRepository(Workspace) private workspaceRepository: BaseRepository<Workspace>,
    private queryOptimizer: QueryOptimizerService,
  ) {}

  async findAll(paginate: PaginationInput, info: GraphQLResolveInfo): Promise<PagiantedWorkspaces> {
    return this.errorHandler.handleServiceMethod(async () => {
      const opt = this.queryOptimizer.generateOptimization(info);
      const workspaces = await this.workspaceRepository.find({
        ...opt,
        ...paginate.paginate(),
      });
      const count = await this.workspaceRepository.count();
      return {
        items: workspaces,
        meta: {
          limit: paginate.limit,
          page: paginate.page,
          totalCount: count,
          totalPages: Math.ceil(count / paginate.limit),
        },
      };
    });
  }

  async findOne(id: number, info?: GraphQLResolveInfo): Promise<Workspace> {
    return this.errorHandler.handleServiceMethod(async () => {
      const opt = this.queryOptimizer.generateOptimization(info);
      const workspace = await this.workspaceRepository.findOne({ where: { id }, ...opt });

      if (!workspace) {
        throw this.errorHandler.notFound(id);
      }

      return workspace;
    });
  }

  async update(id: number, workspace: UpdateWorkspaceInput): Promise<void> {
    return this.errorHandler.handleServiceMethod(async () => {
      await this.ensureWorkspaceExists(id);
      await this.workspaceRepository.update(id, workspace);
    }, 'update');
  }

  private async ensureWorkspaceExists(id: number): Promise<void> {
    const exists = await this.workspaceRepository.exists({ where: { id } });
    if (!exists) {
      throw this.errorHandler.notFound(id);
    }
  }
}

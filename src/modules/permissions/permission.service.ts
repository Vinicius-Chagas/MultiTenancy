/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { BaseRepository } from 'src/database/base-repository';
import { QueryOptimizerService } from '../QueryOptimizer/queryoptimizer.service';
import { GraphQLResolveInfo } from 'graphql';
import { UpdatePermissionInput } from './dto/updatePermissionInput.dto';
import { CreatePermissionInput } from './dto/createPermissionInput';
import { CustomErrors } from 'src/shared/errors/customErrors';
import { In } from 'typeorm';

@Injectable()
export class PermissionService {
  private errorHandler = new CustomErrors('permission');
  constructor(
    @InjectRepository(Permission) private permissionRepository: BaseRepository<Permission>,
    private queryOptimizer: QueryOptimizerService,
  ) {}

  async findAll(info: GraphQLResolveInfo): Promise<Array<Permission>> {
    return this.errorHandler.handleServiceMethod(async () => {
      const opt = this.queryOptimizer.generateOptimization(info);
      const permission = await this.permissionRepository.find({
        ...opt,
      });
      return permission;
    });
  }

  async findOne(id: number, info?: GraphQLResolveInfo): Promise<Permission> {
    return this.errorHandler.handleServiceMethod(async () => {
      const opt = this.queryOptimizer.generateOptimization(info);
      const permission = await this.permissionRepository.findOne({ where: { id }, ...opt });

      if (!permission) {
        throw this.errorHandler.notFound(id);
      }

      return permission;
    });
  }

  async findByIds(ids: number[]): Promise<Permission[]> {
    const permissions = await this.permissionRepository.findBy({ id: In(ids) });
    return permissions;
  }

  async create(permission: CreatePermissionInput): Promise<Permission> {
    return this.errorHandler.handleServiceMethod(async () => {
      const newJob = this.permissionRepository.create(permission);
      return await this.permissionRepository.save(newJob);
    }, 'create');
  }

  async delete(id: number): Promise<void> {
    return this.errorHandler.handleServiceMethod(async () => {
      await this.ensurePermissionExists(id);
      await this.permissionRepository.softDelete({ id });
    }, 'delete');
  }

  async update(id: number, permission: UpdatePermissionInput): Promise<void> {
    return this.errorHandler.handleServiceMethod(async () => {
      await this.ensurePermissionExists(id);
      await this.permissionRepository.update(id, permission);
    }, 'update');
  }

  private async ensurePermissionExists(id: number): Promise<void> {
    const exists = await this.permissionRepository.exists({ where: { id } });
    if (!exists) {
      throw this.errorHandler.notFound(id);
    }
  }
}

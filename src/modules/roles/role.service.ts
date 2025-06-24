/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { BaseRepository } from 'src/database/base-repository';
import { QueryOptimizerService } from '../QueryOptimizer/queryoptimizer.service';
import { GraphQLResolveInfo } from 'graphql';
import { UpdateRoleInput } from './dto/updateRoleInput.dto';
import { CreateRoleInput } from './dto/createRoleInput';
import { PaginationInput } from 'src/shared/dto/paginationInput.dto';
import { CustomErrors } from 'src/shared/errors/customErrors';
import { PaginatedRoles } from './dto/paginatedRoles.dto';
import { PermissionService } from '../permissions/permission.service';
import { In } from 'typeorm';

@Injectable()
export class RoleService {
  private errorHandler = new CustomErrors('role');
  constructor(
    @InjectRepository(Role) private roleRepository: BaseRepository<Role>,
    private queryOptimizer: QueryOptimizerService,
    private readonly permissionService: PermissionService,
  ) {}

  async findAll(paginate: PaginationInput, info: GraphQLResolveInfo): Promise<PaginatedRoles> {
    return this.errorHandler.handleServiceMethod(async () => {
      const opt = this.queryOptimizer.generateOptimization(info);
      const role = await this.roleRepository.find({
        ...opt,
        ...paginate.paginate(),
      });
      const count = await this.roleRepository.count();
      return {
        items: role,
        meta: {
          limit: paginate.limit,
          page: paginate.page,
          totalCount: count,
          totalPages: Math.ceil(count / paginate.limit),
        },
      };
    });
  }

  async findOne(id: number, info?: GraphQLResolveInfo): Promise<Role> {
    return this.errorHandler.handleServiceMethod(async () => {
      const opt = this.queryOptimizer.generateOptimization(info);
      const role = await this.roleRepository.findOne({ where: { id }, ...opt });

      if (!role) {
        throw this.errorHandler.notFound(id);
      }

      return role;
    });
  }

  async create(role: CreateRoleInput): Promise<Role> {
    return this.errorHandler.handleServiceMethod(async () => {
      const { permissionsIds, ...rest } = role;
      const permissions = await this.permissionService.findByIds(permissionsIds);
      const newRole = this.roleRepository.create({
        ...rest,
        permissions,
      });
      const savedRole = await this.roleRepository.save(newRole);
      console.log('New role entity:', savedRole);
      return savedRole;
    }, 'create');
  }

  async delete(id: number): Promise<void> {
    return this.errorHandler.handleServiceMethod(async () => {
      await this.ensureRoleExists(id);
      await this.roleRepository.softDelete({ id });
    }, 'delete');
  }

  async deleteMany(ids: number[]): Promise<void> {
    return this.errorHandler.handleServiceMethod(async () => {
      const foundRoles = await this.roleRepository.existsBy({ id: In(ids) });
      if (!foundRoles) {
        throw this.errorHandler.notFound(1, ids.join(', '));
      }
      await this.roleRepository.softDelete(ids);
    }, 'delete');
  }

  async update(id: number, role: UpdateRoleInput): Promise<void> {
    return this.errorHandler.handleServiceMethod(async () => {
      await this.ensureRoleExists(id);
      await this.roleRepository.update(id, role);
    }, 'update');
  }

  private async ensureRoleExists(id: number): Promise<void> {
    const exists = await this.roleRepository.exists({ where: { id } });
    if (!exists) {
      throw this.errorHandler.notFound(id);
    }
  }
}

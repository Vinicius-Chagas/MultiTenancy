/*
https://docs.nestjs.com/providers#services
*/

import { Inject, Injectable, Scope } from '@nestjs/common';
import { BaseRepository } from 'src/database/base-repository';
import { QueryOptimizerService } from '../QueryOptimizer/queryoptimizer.service';
import { GraphQLResolveInfo } from 'graphql';
import { PaginationInput } from 'src/shared/dto/paginationInput.dto';
import { CustomErrors } from 'src/shared/errors/customErrors';
import { PermissionService } from '../permissions/permission.service';
import { In } from 'typeorm';
import { Department } from './department.entity';
import { PaginatedDepartments } from './dto/paginatedDepartments.dto';
import { CreateDepartmentInput } from './dto/createDepartmentInput';
import { UpdateDepartmentInput } from './dto/updateDepartmentInput.dto';
import { DEPARTMENT_REPOSITORY } from './const';

@Injectable({ scope: Scope.REQUEST })
export class DepartmentService {
  private errorHandler = new CustomErrors('department');
  constructor(
    @Inject(DEPARTMENT_REPOSITORY) private departmentRepository: BaseRepository<Department>,
    private queryOptimizer: QueryOptimizerService,
    private readonly permissionService: PermissionService,
  ) {}

  async findAll(
    paginate: PaginationInput,
    info: GraphQLResolveInfo,
  ): Promise<PaginatedDepartments> {
    return this.errorHandler.handleServiceMethod(async () => {
      const opt = this.queryOptimizer.generateOptimization(info);
      const department = await this.departmentRepository.find({
        ...opt,
        ...paginate.paginate(),
      });
      const count = await this.departmentRepository.count();
      return {
        items: department,
        meta: {
          limit: paginate.limit,
          page: paginate.page,
          totalCount: count,
          totalPages: Math.ceil(count / paginate.limit),
        },
      };
    });
  }

  async findOne(id: number, info?: GraphQLResolveInfo): Promise<Department> {
    return this.errorHandler.handleServiceMethod(async () => {
      const opt = this.queryOptimizer.generateOptimization(info);
      const department = await this.departmentRepository.findOne({ where: { id }, ...opt });

      if (!department) {
        throw this.errorHandler.notFound(id);
      }

      return department;
    });
  }

  async create(department: CreateDepartmentInput): Promise<Department> {
    return this.errorHandler.handleServiceMethod(async () => {
      const savedDepartment = await this.departmentRepository.save(department);
      return savedDepartment;
    }, 'create');
  }

  async delete(id: number): Promise<void> {
    return this.errorHandler.handleServiceMethod(async () => {
      await this.ensureDepartmentExists(id);
      await this.departmentRepository.softDelete({ id });
    }, 'delete');
  }

  async deleteMany(ids: number[]): Promise<void> {
    return this.errorHandler.handleServiceMethod(async () => {
      const foundDepartments = await this.departmentRepository.existsBy({ id: In(ids) });
      if (!foundDepartments) {
        throw this.errorHandler.notFound(1, ids.join(', '));
      }
      await this.departmentRepository.softDelete(ids);
    }, 'delete');
  }

  async update(id: number, department: UpdateDepartmentInput): Promise<void> {
    return this.errorHandler.handleServiceMethod(async () => {
      await this.ensureDepartmentExists(id);
      await this.departmentRepository.update(id, department);
    }, 'update');
  }

  private async ensureDepartmentExists(id: number): Promise<void> {
    const exists = await this.departmentRepository.exists({ where: { id } });
    if (!exists) {
      throw this.errorHandler.notFound(id);
    }
  }
}

import { Injectable, UseGuards, UseInterceptors } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { Args, Info, Int, Mutation, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { PaginationInput } from 'src/shared/dto/paginationInput.dto';
import { PermissionsGuard } from 'src/shared/guards/permissions.guard';
import { PaginatedDepartments } from './dto/paginatedDepartments.dto';
import { Department } from './department.entity';
import { CreateDepartmentInput } from './dto/createDepartmentInput';
import { UpdateDepartmentInput } from './dto/updateDepartmentInput.dto';
import { DatabaseContextInterceptor } from 'src/shared/interceptors/databaseContext.interceptor';
import { SchemaInterceptor } from 'src/shared/interceptors/schema.interceptor';
import { IsPublic } from 'src/shared/decorators/isPublic.decorator';

@Injectable()
@UseGuards(PermissionsGuard)
@IsPublic()
export class DepartmentResolver {
  constructor(private readonly departmentService: DepartmentService) {}

  @Query(() => PaginatedDepartments)
  @UseInterceptors(DatabaseContextInterceptor, SchemaInterceptor)
  async findAllDepartments(
    @Args('paginate') paginate: PaginationInput,
    @Info() info: GraphQLResolveInfo,
  ) {
    return await this.departmentService.findAll(paginate, info);
  }

  @Query(() => Department)
  async findOneDepartment(
    @Args('id', { type: () => Int }) id: number,
    @Info() info: GraphQLResolveInfo,
  ) {
    return await this.departmentService.findOne(id, info);
  }

  @Mutation(() => Department)
  async createDepartment(
    @Args('department', { type: () => CreateDepartmentInput }) department: CreateDepartmentInput,
  ) {
    return await this.departmentService.create(department);
  }

  @Mutation(() => Boolean)
  async deleteDepartment(@Args('id', { type: () => Int }) id: number) {
    await this.departmentService.delete(id);
    return true;
  }

  @Mutation(() => Boolean)
  async deleteManyDepartments(
    @Args({ name: 'ids', type: () => [Int] }) ids: number[],
  ): Promise<boolean> {
    await this.departmentService.deleteMany(ids);
    return true;
  }

  @Mutation(() => Boolean)
  async updateDepartment(
    @Args('id', { type: () => Int }) id: number,
    @Args('department', { type: () => UpdateDepartmentInput }) department: UpdateDepartmentInput,
  ) {
    await this.departmentService.update(id, department);
    return true;
  }
}

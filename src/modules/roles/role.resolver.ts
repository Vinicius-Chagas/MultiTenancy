import { Injectable, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { Args, Info, Int, Mutation, Query } from '@nestjs/graphql';
import { Role } from './role.entity';
import { GraphQLResolveInfo } from 'graphql';
import { CreateRoleInput } from './dto/createRoleInput';
import { UpdateRoleInput } from './dto/updateRoleInput.dto';
import { PaginationInput } from 'src/shared/dto/paginationInput.dto';
import { PaginatedRoles } from './dto/paginatedRoles.dto';
import { PermissionsGuard } from 'src/shared/guards/permissions.guard';
import { RequirePermissions } from 'src/shared/decorators/permissions.decorator';
import { PermissionEnum } from 'src/shared/enums';

@Injectable()
@UseGuards(PermissionsGuard)
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @Query(() => PaginatedRoles)
  async findAllRoles(
    @Args('paginate') paginate: PaginationInput,
    @Info() info: GraphQLResolveInfo,
  ) {
    return await this.roleService.findAll(paginate, info);
  }

  @Query(() => Role)
  async findOneRole(@Args('id', { type: () => Int }) id: number, @Info() info: GraphQLResolveInfo) {
    return await this.roleService.findOne(id, info);
  }

  @Mutation(() => Role)
  @RequirePermissions(PermissionEnum.CREATE_ROLE)
  async createRole(@Args('role', { type: () => CreateRoleInput }) role: CreateRoleInput) {
    return await this.roleService.create(role);
  }

  @Mutation(() => Boolean)
  @RequirePermissions(PermissionEnum.DELETE_ROLE)
  async deleteRole(@Args('id', { type: () => Int }) id: number) {
    await this.roleService.delete(id);
    return true;
  }

  @Mutation(() => Boolean)
  @RequirePermissions(PermissionEnum.DELETE_ROLE)
  async deleteManyRoles(@Args({ name: 'ids', type: () => [Int] }) ids: number[]): Promise<boolean> {
    await this.roleService.deleteMany(ids);
    return true;
  }

  @Mutation(() => Boolean)
  @RequirePermissions(PermissionEnum.EDIT_ROLE)
  async updateRole(
    @Args('id', { type: () => Int }) id: number,
    @Args('role', { type: () => UpdateRoleInput }) role: UpdateRoleInput,
  ) {
    await this.roleService.update(id, role);
    return true;
  }
}

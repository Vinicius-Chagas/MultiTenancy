import { Injectable, UseGuards } from '@nestjs/common';
import { Args, Info, Int, Query } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { PermissionsGuard } from 'src/shared/guards/permissions.guard';
import { PermissionService } from './permission.service';
import { Permission } from './permission.entity';

@Injectable()
@UseGuards(PermissionsGuard)
export class PermissionsResolver {
  constructor(private readonly permissionService: PermissionService) {}

  @Query(() => [Permission])
  async findAllPermissions(@Info() info: GraphQLResolveInfo) {
    return await this.permissionService.findAll(info);
  }

  @Query(() => Permission)
  async findOnePermission(
    @Args('id', { type: () => Int }) id: number,
    @Info() info: GraphQLResolveInfo,
  ) {
    return await this.permissionService.findOne(id, info);
  }
}

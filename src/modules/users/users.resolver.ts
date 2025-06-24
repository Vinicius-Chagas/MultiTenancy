import { Injectable, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Args, Info, Int, Mutation, Query } from '@nestjs/graphql';
import { User } from './user.entity';
import { GraphQLResolveInfo } from 'graphql';
import { CreateUserInput } from './dto/createUserInput.dto';
import { UpdateUserInput } from './dto/updateUserInput.dto';
import { PaginationInput } from 'src/shared/dto/paginationInput.dto';
import { Setup2FAOutput } from '../auth/dtos/setup2FAOutput.dto';
import { SetUp2FAInput } from './dto/setUp2FAInput.dto';
import { Paginatedusers } from './dto/paginatedUsers.dto';
import { definePasswordInput } from './dto/definePasswordInput.dto';
import { IsPublic } from 'src/shared/decorators/isPublic.decorator';
import { RequirePermissions } from 'src/shared/decorators/permissions.decorator';
import { PermissionEnum } from 'src/shared/enums';
import { PermissionsGuard } from 'src/shared/guards/permissions.guard';

@Injectable()
@IsPublic()
@UseGuards(PermissionsGuard)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Query(() => Paginatedusers)
  async findAllUsers(
    @Args('paginate') paginate: PaginationInput,
    @Info() info: GraphQLResolveInfo,
  ) {
    return await this.userService.findAll(paginate, info);
  }

  @Query(() => User)
  async findOneUser(@Args('id', { type: () => Int }) id: number, @Info() info: GraphQLResolveInfo) {
    return await this.userService.findOne(id, info);
  }

  @Mutation(() => User)
  @RequirePermissions(PermissionEnum.CREATE_USER)
  async createUser(@Args('user', { type: () => CreateUserInput }) user: CreateUserInput) {
    return await this.userService.create(user);
  }

  @IsPublic()
  @Mutation(() => Boolean)
  async definePassword(
    @Args('password', { type: () => definePasswordInput }) password: definePasswordInput,
  ) {
    return await this.userService.definePassword(password);
  }

  @IsPublic()
  @Query(() => User)
  async findOneByDefinePasswordPath(@Args('path') path: string, @Info() info: GraphQLResolveInfo) {
    return await this.userService.findOneByDefinePasswordPath(path, info);
  }

  @Mutation(() => Boolean)
  @RequirePermissions(PermissionEnum.DELETE_USER)
  async deleteUser(@Args('id', { type: () => Int }) id: number) {
    await this.userService.delete(id);
    return true;
  }

  @Mutation(() => Boolean)
  @RequirePermissions(PermissionEnum.DELETE_USER)
  async deleteManyUsers(@Args({ name: 'ids', type: () => [Int] }) ids: number[]): Promise<boolean> {
    await this.userService.deleteMany(ids);
    return true;
  }

  @Mutation(() => Boolean)
  @RequirePermissions(PermissionEnum.EDIT_USER)
  async updateUser(
    @Args('id', { type: () => Int }) id: number,
    @Args('user', { type: () => UpdateUserInput }) user: UpdateUserInput,
  ) {
    await this.userService.update(id, user);
    return true;
  }

  @Mutation(() => Setup2FAOutput)
  async setUp2FA(
    @Args('credentials', { type: () => SetUp2FAInput }) credentials: SetUp2FAInput,
  ): Promise<Setup2FAOutput> {
    return await this.userService.setup2FA(credentials);
  }
}

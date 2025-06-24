import { Injectable, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { Args, Info, Int, Mutation, Query } from '@nestjs/graphql';
import { Company } from './company.entity';
import { GraphQLResolveInfo } from 'graphql';
import { CreateCompanyInput } from './dto/createCompany.input';
import { UpdateCompanyInput } from './dto/updateCompany.input';
import { PaginationInput } from 'src/shared/dto/paginationInput.dto';
import { paginatedCompany } from './dto/paginatedCompany.output';
import { RequirePermissions } from 'src/shared/decorators/permissions.decorator';
import { PermissionEnum } from 'src/shared/enums';
import { PermissionsGuard } from 'src/shared/guards/permissions.guard';

@Injectable()
@UseGuards(PermissionsGuard)
export class CompanyResolver {
  constructor(private readonly companyService: CompanyService) {}

  @Query(() => paginatedCompany)
  async findAllCompanies(
    @Args('paginate') paginate: PaginationInput,
    @Info() info: GraphQLResolveInfo,
  ) {
    return await this.companyService.findAll(paginate, info);
  }

  @Query(() => Company)
  async findOneCompany(
    @Args('id', { type: () => Int }) id: number,
    @Info() info: GraphQLResolveInfo,
  ) {
    return await this.companyService.findOne(id, info);
  }

  @Mutation(() => Company)
  @RequirePermissions(PermissionEnum.CREATE_COMP)
  async createCompany(
    @Args('company', { type: () => CreateCompanyInput }) company: CreateCompanyInput,
  ) {
    return await this.companyService.create(company);
  }

  @Mutation(() => Boolean)
  @RequirePermissions(PermissionEnum.DELETE_COMP)
  async deleteCompany(@Args('id', { type: () => Int }) id: number) {
    await this.companyService.delete(id);
    return true;
  }

  @Mutation(() => Boolean)
  @RequirePermissions(PermissionEnum.DELETE_COMP)
  async deleteManyCompanies(
    @Args({ name: 'ids', type: () => [Int] }) ids: number[],
  ): Promise<boolean> {
    await this.companyService.deleteMany(ids);
    return true;
  }

  @Mutation(() => Boolean)
  @RequirePermissions(PermissionEnum.EDIT_COMP)
  async updateCompany(
    @Args('id', { type: () => Int }) id: number,
    @Args('company', { type: () => UpdateCompanyInput }) company: UpdateCompanyInput,
  ) {
    await this.companyService.update(id, company);
    return true;
  }
}

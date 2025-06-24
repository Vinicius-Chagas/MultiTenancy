/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { BaseRepository } from 'src/database/base-repository';
import { QueryOptimizerService } from '../QueryOptimizer/queryoptimizer.service';
import { GraphQLResolveInfo } from 'graphql';
import { UpdateCompanyInput } from './dto/updateCompany.input';
import { CreateCompanyInput } from './dto/createCompany.input';
import { PaginationInput } from 'src/shared/dto/paginationInput.dto';
import { CustomErrors } from 'src/shared/errors/customErrors';
import { paginatedCompany } from './dto/paginatedCompany.output';
import { In } from 'typeorm';

@Injectable()
export class CompanyService {
  private errorHandler = new CustomErrors('company');
  constructor(
    @InjectRepository(Company) private companyRepository: BaseRepository<Company>,
    private queryOptimizer: QueryOptimizerService,
  ) {}

  async findAll(paginate: PaginationInput, info: GraphQLResolveInfo): Promise<paginatedCompany> {
    return this.errorHandler.handleServiceMethod(async () => {
      const opt = this.queryOptimizer.generateOptimization(info);
      console.log('Query Optimization Options:', opt);
      const companies = await this.companyRepository.find({ ...opt, ...paginate.paginate() });
      console.log('Companies found:', companies);
      const count = await this.companyRepository.count();
      return {
        items: companies,
        meta: {
          limit: paginate.limit,
          page: paginate.page,
          totalCount: count,
          totalPages: Math.ceil(count / paginate.limit),
        },
      };
    });
  }

  async findOne(id: number, info?: GraphQLResolveInfo): Promise<Company> {
    return this.errorHandler.handleServiceMethod(async () => {
      const opt = this.queryOptimizer.generateOptimization(info);
      const company = await this.companyRepository.findOne({ where: { id }, ...opt });

      if (!company) {
        throw this.errorHandler.notFound(id);
      }

      return company;
    });
  }

  async duplicatedCompany(email: string, document: string): Promise<boolean> {
    return this.errorHandler.handleServiceMethod(async () => {
      const exists = await this.companyRepository.exists({
        where: [{ email: email.trim() }, { document: document.trim() }],
      });
      if (exists) {
        throw this.errorHandler.duplicateError(
          1,
          'Compania já cadastrado com esse email ou Documento',
        );
      }
      return exists;
    });
  }

  async create(company: CreateCompanyInput): Promise<Company> {
    return this.errorHandler.handleServiceMethod(async () => {
      return await this.companyRepository.save(company);
    }, 'create');
  }

  async delete(id: number): Promise<void> {
    return this.errorHandler.handleServiceMethod(async () => {
      await this.ensureCompanyExists(id);
      await this.companyRepository.softDelete({ id });
    }, 'delete');
  }

  async deleteMany(ids: number[]): Promise<void> {
    return this.errorHandler.handleServiceMethod(async () => {
      const exists = await this.companyRepository.existsBy({ id: In(ids) });
      if (!exists) {
        throw this.errorHandler.notFound(1, ids.join(', '));
      }
      await this.companyRepository.softDelete(ids);
    }, 'delete');
  }

  async update(id: number, company: UpdateCompanyInput): Promise<void> {
    return this.errorHandler.handleServiceMethod(async () => {
      await this.ensureCompanyExists(id);
      await this.companyRepository.update(id, company);
    }, 'update');
  }

  private async ensureCompanyExists(id: number): Promise<void> {
    const exists = await this.companyRepository.exists({ where: { id } });
    if (!exists) {
      throw this.errorHandler.notFound(id);
    }
  }
}

import { RepositoryInjectionProvider } from 'src/utils/RepositoryInjectionProvider';
import { CompanyResolver } from './company.resolver';
import { CompanyService } from './company.service';
import { Module } from '@nestjs/common';
import { Company } from './company.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueryOptimizerModule } from '../QueryOptimizer/queryoptimizer.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [TypeOrmModule.forFeature([Company]), DatabaseModule, QueryOptimizerModule],
  providers: [CompanyService, CompanyResolver, RepositoryInjectionProvider(Company)],
  exports: [CompanyService],
})
export class CompanyModule {}

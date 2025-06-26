import { RepositoryInjectionProvider } from 'src/utils/RepositoryInjectionProvider';
import { CompanyResolver } from './company.resolver';
import { CompanyService } from './company.service';
import { Module } from '@nestjs/common';
import { Company } from './company.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Company]), UsersModule],
  providers: [CompanyService, CompanyResolver, RepositoryInjectionProvider(Company)],
  exports: [CompanyService],
})
export class CompanyModule {}

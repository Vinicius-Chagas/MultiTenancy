import { RepositoryInjectionProvider } from 'src/utils/RepositoryInjectionProvider';
import { PermissionService } from './permission.service';
import { Module } from '@nestjs/common';
import { Permission } from './permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueryOptimizerModule } from '../QueryOptimizer/queryoptimizer.module';
import { DatabaseModule } from 'src/database/database.module';
import { PermissionsResolver } from './permissions.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Permission]), DatabaseModule, QueryOptimizerModule],
  providers: [PermissionService, RepositoryInjectionProvider(Permission), PermissionsResolver],
  exports: [PermissionService],
})
export class PermissionModule {}

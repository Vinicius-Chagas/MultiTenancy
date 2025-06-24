import { RepositoryInjectionProvider } from 'src/utils/RepositoryInjectionProvider';
import { WorkspaceService } from './workspace.service';
import { Module } from '@nestjs/common';
import { Workspace } from './workspace.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueryOptimizerModule } from '../QueryOptimizer/queryoptimizer.module';
import { DatabaseModule } from 'src/database/database.module';
import { WorkspaceResolver } from './workspace.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Workspace]), DatabaseModule, QueryOptimizerModule],
  providers: [WorkspaceService, WorkspaceResolver, RepositoryInjectionProvider(Workspace)],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}

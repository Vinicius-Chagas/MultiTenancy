import { RepositoryInjectionProvider } from 'src/utils/RepositoryInjectionProvider';
import { WorkspaceService } from './workspace.service';
import { Module } from '@nestjs/common';
import { Workspace } from './workspace.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceResolver } from './workspace.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Workspace])],
  providers: [WorkspaceService, WorkspaceResolver, RepositoryInjectionProvider(Workspace)],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}

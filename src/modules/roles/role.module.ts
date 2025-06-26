import { RepositoryInjectionProvider } from 'src/utils/RepositoryInjectionProvider';
import { RoleService } from './role.service';
import { Module } from '@nestjs/common';
import { Role } from './role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleResolver } from './role.resolver';
import { PermissionModule } from '../permissions/permission.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role]), PermissionModule],
  providers: [RoleService, RoleResolver, RepositoryInjectionProvider(Role)],
  exports: [RoleService],
})
export class RoleModule {}

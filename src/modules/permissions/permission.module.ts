import { RepositoryInjectionProvider } from 'src/utils/RepositoryInjectionProvider';
import { PermissionService } from './permission.service';
import { Module } from '@nestjs/common';
import { Permission } from './permission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsResolver } from './permissions.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  providers: [PermissionService, RepositoryInjectionProvider(Permission), PermissionsResolver],
  exports: [PermissionService],
})
export class PermissionModule {}

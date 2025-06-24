import { Module, Scope } from '@nestjs/common';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { QueryOptimizerModule } from '../QueryOptimizer/queryoptimizer.module';
import { DatabaseModule } from 'src/database/database.module';
import { PermissionModule } from '../permissions/permission.module';
import { Department } from './department.entity';
import { DepartmentService } from './department.service';
import { DepartmentResolver } from './department.resolver';
import { DataSource } from 'typeorm';
import { RequestContextService } from 'src/database/requestContext.service';
import { BaseRepository } from 'src/database/base-repository';
import { DEPARTMENT_REPOSITORY } from './const';

@Module({
  imports: [
    TypeOrmModule.forFeature([Department]),
    PermissionModule,
    DatabaseModule,
    QueryOptimizerModule,
  ],
  providers: [
    DepartmentService,
    DepartmentResolver,
    {
      // Provide our custom repository using its unique token.
      provide: DEPARTMENT_REPOSITORY,
      scope: Scope.REQUEST,
      useFactory: (dataSource: DataSource, requestContext: RequestContextService) => {
        console.log(`Creating repository for entity: ${Department.name}`);

        // This factory will now be called for each new request.
        return new BaseRepository<Department>(Department, dataSource, requestContext);
      },
      inject: [getDataSourceToken(), RequestContextService],
    },
  ],
  exports: [DepartmentService],
})
export class DepartmentModule {}

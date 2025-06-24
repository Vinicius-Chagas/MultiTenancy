import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { BaseRepository } from 'src/database/base-repository';
import { RequestContextService } from 'src/database/requestContext.service';
import { DataSource, ObjectLiteral } from 'typeorm';

export function RepositoryInjectionProvider<T extends ObjectLiteral>(entity: new () => T) {
  return {
    provide: getRepositoryToken(entity),
    useFactory: (dataSource: DataSource, requestContext: RequestContextService) => {
      console.log(`Creating repository for entity: ${entity.name}`);
      return new BaseRepository<T>(entity, dataSource, requestContext);
    },
    inject: [getDataSourceToken(), RequestContextService],
  };
}

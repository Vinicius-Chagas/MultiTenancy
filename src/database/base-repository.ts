import { DataSource, EntityTarget, ObjectLiteral, Repository } from 'typeorm';
import { RequestContextService } from './requestContext.service';

/**
 * A custom, request-aware repository that dynamically resolves the correct
 * EntityManager. This is the core of the multi-tenancy transaction strategy.
 */
export class BaseRepository<T extends ObjectLiteral> extends Repository<T> {
  private readonly dataSource: DataSource;
  private readonly requestContext?: RequestContextService;

  constructor(
    entity: EntityTarget<T>,
    dataSource: DataSource,
    requestContext?: RequestContextService,
  ) {
    super(entity, dataSource.manager);

    this.dataSource = dataSource;
    this.requestContext = requestContext;

    // Define a getter for the manager property that resolves the correct EntityManager
    Object.defineProperty(this, 'manager', {
      get: () => {
        const queryRunner = this.requestContext?.getQueryRunner();
        return queryRunner ? queryRunner.manager : this.dataSource.manager;
      },
    });
  }
}

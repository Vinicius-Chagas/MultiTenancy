import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { QueryRunner } from 'typeorm';

@Injectable()
export class RequestContextService {
  private readonly als = new AsyncLocalStorage<{ queryRunner: QueryRunner }>();

  run(queryRunner: QueryRunner, callback: () => any): any {
    const context = this.als.run({ queryRunner }, callback);
    console.log('RequestContextService: Running callback with QueryRunner in context');
    return context;
  }

  getQueryRunner(): QueryRunner | undefined {
    return this.als.getStore()?.queryRunner;
  }
}

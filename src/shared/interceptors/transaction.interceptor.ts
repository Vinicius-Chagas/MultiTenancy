import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';
import { RequestContextService } from 'src/database/requestContext.service';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly requestContext: RequestContextService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const queryRunner = this.requestContext.getQueryRunner();

    if (!queryRunner) {
      throw new InternalServerErrorException(
        'TransactionInterceptor requires DatabaseContextInterceptor to be used first.',
      );
    }
    console.log('TransactionInterceptor: Starting transaction.');
    await queryRunner.startTransaction();

    return next.handle().pipe(
      concatMap(async (data) => {
        console.log('TransactionInterceptor: Committing transaction.');
        await queryRunner.commitTransaction();
        return data;
      }),
      catchError(async (error) => {
        if (queryRunner.isTransactionActive) {
          console.error('TransactionInterceptor: Error occurred, rolling back transaction:', error);
          await queryRunner.rollbackTransaction();
        }
        throw error;
      }),
    );
  }
}

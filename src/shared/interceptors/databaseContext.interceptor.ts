import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DbConnection } from 'src/database/dbConnection';
import { RequestContextService } from 'src/database/requestContext.service';
import { QueryRunner } from 'typeorm';

/**
 * Manages the lifecycle of a QueryRunner for a single request.
 * It MUST be the first interceptor in any chain that requires database access.
 * Its sole responsibility is to create, provide via context, and guarantee the release of a QueryRunner.
 */
@Injectable()
export class DatabaseContextInterceptor implements NestInterceptor {
  constructor(
    private readonly dbConnection: DbConnection,
    private readonly requestContext: RequestContextService,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    console.log('DatabaseContextInterceptor: Creating QueryRunner');

    const queryRunner = this.dbConnection.dataSource.createQueryRunner();

    await queryRunner.connect();

    return this.requestContext.run(queryRunner, () =>
      next.handle().pipe(
        finalize(() => {
          if (queryRunner && !queryRunner.isReleased) {
            const cleanup = async () => {
              try {
                await queryRunner.query(`SET search_path TO DEFAULT`);
              } catch (error) {
                console.error('Failed to reset search_path during cleanup', error);
              } finally {
                await this.releaseQueryRunnerWithRetry(queryRunner);
              }
            };
            void cleanup();
          }
        }),
      ),
    );
  }

  private async releaseQueryRunnerWithRetry(queryRunner: QueryRunner): Promise<void> {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        await queryRunner.release();
        console.log('DatabaseContextInterceptor: QueryRunner released successfully');
        break;
      } catch (error) {
        attempt++;
        console.error('Error releasing queryRunner:', error);
        if (attempt > maxRetries) {
          console.error('Failed to release queryRunner after multiple attempts:', error);
          break;
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  }
}

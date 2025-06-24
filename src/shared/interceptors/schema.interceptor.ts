import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RequestContextService } from 'src/database/requestContext.service';

@Injectable()
export class SchemaInterceptor implements NestInterceptor {
  constructor(private readonly requestContext: RequestContextService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const queryRunner = this.requestContext.getQueryRunner();
    console.log('SchemaInterceptor: Intercepting request for schema management.');

    if (!queryRunner) {
      throw new InternalServerErrorException(
        'SchemaInterceptor requires DatabaseContextInterceptor to be used first.',
      );
    }

    // TODO: Replace 'teste' with dynamic schema logic (e.g., from headers, JWT).
    const schema = 'teste2';

    if (!/^[a-zA-Z0-9_]+$/.test(schema)) {
      throw new InternalServerErrorException('Invalid schema name format.');
    }

    await queryRunner.query(`SET search_path TO "${schema}"`);

    return next.handle();
  }
}

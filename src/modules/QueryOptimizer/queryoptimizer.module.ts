/*
https://docs.nestjs.com/modules
*/

import { Global, Module } from '@nestjs/common';
import { QueryOptimizerService } from './queryoptimizer.service';

@Global()
@Module({
  providers: [QueryOptimizerService],
  exports: [QueryOptimizerService],
})
export class QueryOptimizerModule {}

/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { QueryOptimizerService } from './queryoptimizer.service';

@Module({
  providers: [QueryOptimizerService],
  exports: [QueryOptimizerService],
})
export class QueryOptimizerModule {}

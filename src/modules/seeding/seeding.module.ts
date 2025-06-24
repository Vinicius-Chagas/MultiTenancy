import { CoreSeedingService } from './core.seed.service';
import { Module } from '@nestjs/common';
import { TenantSeedingService } from './tenan.seed.service';

@Module({
  imports: [],
  providers: [CoreSeedingService, TenantSeedingService],
  exports: [CoreSeedingService, TenantSeedingService],
})
export class SeedingModule {}

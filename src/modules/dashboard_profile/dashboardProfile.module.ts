import { Module } from '@nestjs/common';
import { DashboardProfile } from './dashboard_profile.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DashboardProfile])],
})
export class DashboardProfileModule {}

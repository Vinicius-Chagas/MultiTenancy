import { Module } from '@nestjs/common';
import { workspaceMember } from './workspaceMember';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([workspaceMember])],
})
export class workspaceMembersModule {}

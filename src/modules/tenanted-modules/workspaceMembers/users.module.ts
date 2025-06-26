import { RepositoryInjectionProvider } from 'src/utils/RepositoryInjectionProvider';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { Module } from '@nestjs/common';
import { User } from './workspaceMember';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueryOptimizerModule } from '../QueryOptimizer/queryoptimizer.module';
import { DatabaseModule } from 'src/database/database.module';
import { TwoFactorModule } from '../TwoFactorModule/twoFactor.module';
import { MailModule } from '../mail/mail.module';
import { RoleModule } from '../roles/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    DatabaseModule,
    QueryOptimizerModule,
    TwoFactorModule,
    MailModule,
    RoleModule,
  ],
  providers: [UsersService, UsersResolver, RepositoryInjectionProvider(User)],
  exports: [UsersService],
})
export class UsersModule {}

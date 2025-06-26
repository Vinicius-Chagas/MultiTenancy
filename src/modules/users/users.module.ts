import { RepositoryInjectionProvider } from 'src/utils/RepositoryInjectionProvider';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { Module } from '@nestjs/common';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TwoFactorModule } from '../TwoFactorModule/twoFactor.module';
import { MailModule } from '../mail/mail.module';
import { RoleModule } from '../roles/role.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), TwoFactorModule, MailModule, RoleModule],
  providers: [UsersService, UsersResolver, RepositoryInjectionProvider(User)],
  exports: [UsersService],
})
export class UsersModule {}

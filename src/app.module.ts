import { MailModule } from './modules/mail/mail.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/typeorm/config';
import { QueryOptimizerModule } from './modules/QueryOptimizer/queryoptimizer.module';
import { DatabaseModule } from './database/database.module';
import { GuardsModule } from './shared/guards/guards.module';
import { TwoFactorModule } from './modules/TwoFactorModule/twoFactor.module';
import { PermissionModule } from './modules/permissions/permission.module';
import { RoleModule } from './modules/roles/role.module';
import { CompanyModule } from './modules/companies/company.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { SeedingModule } from './modules/seeding/seeding.module';
import { DepartmentModule } from './modules/department/department.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    CompanyModule,
    DatabaseModule,
    DepartmentModule,
    GuardsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      sortSchema: true,
      debug: true,
      playground: true,
      context: ({ req, res }: { req: Request; res: Response }) => ({ req, res }),
      formatError: (error) => {
        console.error('GraphQL Error:', error);
        return error;
      },
    }),
    MailModule,
    PermissionModule,
    QueryOptimizerModule,
    RoleModule,
    SeedingModule,
    TwoFactorModule,
    UsersModule,
    WorkspaceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Global, Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { DatabaseConfig } from 'src/config/typeorm/database-config.factory';
import { DbConnection } from './dbConnection';
import { CoreSeedingService } from 'src/modules/seeding/core.seed.service';
import { TenantSeedingService } from 'src/modules/seeding/tenan.seed.service';
import { RequestContextService } from './requestContext.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: DatabaseConfig,
      dataSourceFactory: async (options: DataSourceOptions) => {
        if (options) {
          const dataSource = await new DataSource(options).initialize();

          // Type guard to ensure options is for PostgreSQL
          if ('host' in options && 'port' in options) {
            const result = await dataSource.query('SELECT current_schema() AS schema');
            console.log('Database Connection Details:');
            console.log(`- Host: ${options.host}`);
            console.log(`- Port: ${options.port}`);
            console.log(`- Database: ${options.database}`);
            console.log(`- Schema: ${result[0].schema}`);
          } else {
            console.warn('Database connection options do not include host/port (likely SQLite).');
          }

          return dataSource;
        }
        throw new Error('Database connection options are not defined');
      },
    }),
  ],
  providers: [DbConnection, CoreSeedingService, TenantSeedingService, RequestContextService],
  exports: [DbConnection, RequestContextService],
})
export class DatabaseModule implements OnApplicationBootstrap {
  constructor(private readonly seed: CoreSeedingService) {}

  async onApplicationBootstrap() {
    await this.seed.run();
    const tenant1 = new TenantSeedingService('teste');
    await tenant1.run();
    const tenant2 = new TenantSeedingService('teste2');
    await tenant2.run();
  }
}

import { DataSourceOptions } from 'typeorm';
import { join } from 'path';

export default (): { db: { autoLoadEntities: boolean } & DataSourceOptions } => ({
  db: {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    cache: false,
    port: parseInt(process.env.DB_PORT || '', 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'chatmix',
    synchronize: process.env.DB_SYNC === 'true',
    migrationsRun: false,
    entities: [join(__dirname, '../../**/*.entity.ts')],
    migrations: [join(__dirname, '../../database/migrations/**/*.ts')],
    autoLoadEntities: true,
    logging: process.env.DB_LOGGING !== 'false',
    connectTimeoutMS: 30000, // 30 seconds
    maxQueryExecutionTime: 10000, // 10 seconds
    ssl: false,
    extra: {
      connectionLimit: 20,
      idleTimeoutMillis: 30000, // 30 seconds
      acquireTimeout: 30000, // 30 seconds
    },
  },
});

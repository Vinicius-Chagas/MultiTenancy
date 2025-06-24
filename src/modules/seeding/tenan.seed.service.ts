/*
https://docs.nestjs.com/providers#services
*/

import { DataSource, DataSourceOptions } from 'typeorm';
import publicDataSource from '../../database/data-source';
import { createSpinner } from 'src/utils/createSpinner';
import { join } from 'path';

export class TenantSeedingService {
  private readonly dataSource: DataSource;
  private readonly schema: string;
  constructor(schema: string) {
    this.schema = schema;
    this.dataSource = new DataSource({
      ...publicDataSource.options,
      schema: schema,
      migrations: [join(__dirname, '../../database/migrations/tenanted/*.js')],
      logging: false,
      migrationsTransactionMode: 'each',
    } as DataSourceOptions);
  }

  async run() {
    console.log('path: ' + join(__dirname, '../../database/migrations/tenanted/*.js'));
    const migrationsSpinner = createSpinner(
      `Executando as migrações do banco de dados ${this.schema}...`,
    );
    try {
      await this.dataSource.initialize();
      await this.dataSource.query(`CREATE SCHEMA IF NOT EXISTS "${this.schema}"`);
      if (!(await this.dataSource.showMigrations())) {
        migrationsSpinner();
        console.log(
          '\x1b[32m%s\x1b[0m',
          `✔  Nenhuma seed pendente encontrada para o banco de dados ${this.schema}.`,
          '\n',
        );
        return;
      }
      await this.dataSource.runMigrations();
      migrationsSpinner();
      console.log('\x1b[32m%s\x1b[0m', '✔ Migrações executadas com sucesso!', '\n');
    } catch (error) {
      migrationsSpinner();
      console.error(
        '\x1b[31m%s\x1b[0m',
        '✘ Erro ao executar as migrações do banco de dados core.',
        error,
        '\n',
      );
    } finally {
      await this.dataSource.destroy();
    }
  }
}

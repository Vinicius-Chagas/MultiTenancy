/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import publicDataSource from '../../database/data-source';
import { createSpinner } from 'src/utils/createSpinner';
import { join } from 'path';

@Injectable()
export class CoreSeedingService {
  private readonly dataSource: DataSource;
  constructor() {
    this.dataSource = new DataSource({
      ...publicDataSource.options,
      schema: 'core',
      migrations: [join(__dirname, 'seeds/core/*.js')],
      migrationsTableName: 'seeds',
      logging: false,
      migrationsTransactionMode: 'each',
    } as DataSourceOptions);
  }

  async run() {
    const migrationsSpinner = createSpinner('Executando as migrações do banco de dados core...');
    try {
      await this.dataSource.initialize();
      if (!(await this.dataSource.showMigrations())) {
        migrationsSpinner();
        console.log(
          '\x1b[32m%s\x1b[0m',
          '✔  Nenhuma seed pendente encontrada para o banco de dados core.',
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

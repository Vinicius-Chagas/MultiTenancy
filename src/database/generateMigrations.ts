import { DataSource, DataSourceOptions } from 'typeorm';
import PublicDataSource from './data-source';
import { camelCase } from 'typeorm/util/StringUtils';
import { join } from 'path';
import { exec } from 'child_process';
import { writeFile } from 'fs/promises';
import { promisify } from 'util';
import { createInterface } from 'readline';
import { createSpinner } from 'src/utils/createSpinner';

const DEFAULT_SCHEMA = 'tenant_default';
const CORE_SCHEMA = `"core"`;
const NON_CORE_SCHEMA = `"nonCore"`;
const execAsync = promisify(exec);

type MigrationType = 'core' | 'tenanted';

/** Formats query parameters for inclusion in the migration file. */
function queryParams(parameters: any[] | undefined): string {
  if (!parameters || !parameters.length) {
    return '';
  }
  return `, ${JSON.stringify(parameters)}`;
}

/** Logs a warning message in yellow. */
function warn(message: string) {
  console.warn('\x1b[33m%s\x1b[0m', message);
}

/** Logs a success message in green. */
function success(message: string) {
  console.log('\x1b[32m%s\x1b[0m', `✔ ${message}`); // Added checkmark
}

/** Logs an error message in red. */
function errorLog(message: string) {
  console.error('\x1b[31m%s\x1b[0m', `✖ ${message}`); // Added cross mark
}

/** Asks a question in the CLI and returns the answer. */
async function askQuestion(
  question: string,
  proceede: string[],
  stop: string = 'n',
): Promise<{ continue: boolean; response: string }> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`\n${question} : `, (answer: string) => {
      rl.close();
      const normalizedAnswer = answer.trim().toLowerCase();
      if (proceede.includes(normalizedAnswer) || normalizedAnswer === '') {
        resolve({
          continue: true,
          response: normalizedAnswer,
        }); // Continua se o usuário digitar "y" ou pressionar Enter
      } else if (normalizedAnswer === stop) {
        resolve({
          continue: false,
          response: normalizedAnswer,
        }); // Para se o usuário digitar "n"
      } else {
        console.log(
          `Resposta inválida. Digite uma das alternativas possíveis ou ${stop} para sair.`,
        );
        resolve(askQuestion(question, proceede, stop)); // Pergunta novamente em caso de resposta inválida
      }
    });
  });
}

function environmentType(environment: string): void {
  // Validate and set NODE_ENV
  if (['dev', 'development'].includes(environment)) {
    process.env.NODE_ENV = 'development';
  } else if (['test', 'testing'].includes(environment)) {
    process.env.NODE_ENV = 'test';
  } else if (['prod', 'production'].includes(environment)) {
    process.env.NODE_ENV = 'production';
  } else {
    errorLog('Invalid environment. Choose dev/development, test/testing, or prod/production.');
    process.exit(1);
  }
}

// --- DataSource Configuration ---

function configureDataSource(type: MigrationType): DataSource {
  let options: DataSourceOptions;

  if (type === 'core') {
    options = {
      ...PublicDataSource.options,
      schema: NON_CORE_SCHEMA,
      logging: false,
    } as DataSourceOptions;
  } else {
    // type === 'tenanted'
    options = {
      ...PublicDataSource.options,
      schema: DEFAULT_SCHEMA,
      logging: false,
    } as DataSourceOptions;
  }
  return new DataSource(options);
}

// --- Core Logic Functions ---

async function generateMigrationQueries(
  dataSource: DataSource,
  type: MigrationType,
): Promise<{ upSqls: string[]; downSqls: string[] }> {
  let stopSpinner = createSpinner('Initializing data source...');
  try {
    await dataSource.initialize();
    stopSpinner();
    success('Data source initialized.');
  } catch (error) {
    stopSpinner();
    errorLog(`Error initializing data source: ${error.message}`);
    throw error;
  }

  stopSpinner = createSpinner('Comparando database schema...');
  let logs;
  try {
    logs = await dataSource.driver.createSchemaBuilder().log();
    stopSpinner();
    success('Database schema comparado.');
  } catch (error) {
    stopSpinner();
    errorLog(`Error comparando schema: ${error.message}`);
    throw error;
  }

  stopSpinner = createSpinner('Processando queries...');
  try {
    const processQuery = (
      query: { query: string; parameters?: any[] },
      schemaPlaceholder: string | null,
    ): string | null => {
      const baseQuery = query.query;
      const params = queryParams(query.parameters);

      if (type === 'tenanted') {
        if (baseQuery.includes(CORE_SCHEMA)) return null;
        const replacedQuery = baseQuery
          .replace(/`/g, '\\`')
          .replace(new RegExp(DEFAULT_SCHEMA, 'g'), schemaPlaceholder!);
        return `await queryRunner.query(\`${replacedQuery}\`${params});`;
      } else {
        // type === 'core'
        if (baseQuery.includes(NON_CORE_SCHEMA)) return null;
        return `await queryRunner.query(\`${baseQuery.replace(/`/g, '\\`')}\`${params});`;
      }
    };

    const upPromises = logs.upQueries.map((q) => Promise.resolve(processQuery(q, '${schema}')));
    const downPromises = logs.downQueries.map((q) => Promise.resolve(processQuery(q, '${schema}')));

    const resolvedUpSqls = await Promise.all(upPromises);
    const resolvedDownSqls = await Promise.all(downPromises);

    const upSqls = resolvedUpSqls.filter((sql): sql is string => sql !== null);
    const downSqls = resolvedDownSqls.filter((sql): sql is string => sql !== null);

    stopSpinner();
    success('Queries processados.');
    return { upSqls, downSqls };
  } catch (error) {
    stopSpinner();
    errorLog(`Error processing queries: ${error.message}`);
    throw error;
  }
}

function getTemplate(
  name: string,
  timestamp: number,
  upSqls: string[],
  downSqls: string[],
  type: MigrationType,
): string {
  const migrationName = `${camelCase(name, true)}${timestamp}`;
  const imports = `import { MigrationInterface, QueryRunner } from 'typeorm';\nimport { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';\n`;

  const upMethodContent =
    type === 'tenanted'
      ? `    const { schema } = queryRunner.connection.options as PostgresConnectionOptions;\n    ${upSqls.join('\n    ')}`
      : `    ${upSqls.join('\n    ')}`;

  const downMethodContent =
    type === 'tenanted'
      ? `    const { schema } = queryRunner.connection.options as PostgresConnectionOptions;\n    ${downSqls.join('\n    ')}`
      : `    ${downSqls.join('\n    ')}`;

  return `${imports}
export class ${migrationName} implements MigrationInterface {
  name = '${migrationName}';

  public async up(queryRunner: QueryRunner): Promise<void> {
${upMethodContent}
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
${downMethodContent}
  }
}
`;
}

function validateQueries(upSqls: string[], downSqls: string[], type: MigrationType): void {
  const errors: string[] = [];
  const allSqls = [...upSqls, ...downSqls];

  allSqls.forEach((query) => {
    const isCoreQuery = query.includes(CORE_SCHEMA);
    const isTenantedPlaceholderQuery = query.includes('${schema}');

    if (type === 'core' && !isCoreQuery && query.includes('TABLE')) {
      errors.push(
        `Query tipo 'core' parece não referenciar o schema "${CORE_SCHEMA}": ${query.substring(0, 100)}...`,
      );
    }
    if (type === 'tenanted' && isCoreQuery) {
      errors.push(
        `Query tipo 'tenanted' não deve referenciar o schema "${CORE_SCHEMA}" diretamente: ${query.substring(0, 100)}...`,
      );
    }
    if (type === 'tenanted' && !isTenantedPlaceholderQuery && query.includes('TABLE')) {
      errors.push(
        `Query tipo 'tenanted' parece não usar o placeholder "\${schema}": ${query.substring(0, 100)}...`,
      );
    }
  });

  if (errors.length > 0) {
    errorLog('⚠️ Erros de validação encontrados nas queries geradas:');
    errors.forEach((error) => errorLog(`  - ${error}`));
    throw new Error('Validação das queries falhou.');
  }
  success('Validação das queries concluída.');
}

async function formatAndLintFile(filePath: string): Promise<void> {
  let stopSpinner = createSpinner(`Formatando arquivo: ${filePath}...`);
  try {
    await execAsync(`npx prettier --write ${filePath}`);
    stopSpinner();
    success('Arquivo formatado (Prettier).');
  } catch (error) {
    stopSpinner();
    errorLog(`Erro ao formatar com Prettier: ${error.stderr || error.message}`);
  }

  stopSpinner = createSpinner(`Analisando arquivo (ESLint): ${filePath}...`);
  try {
    await execAsync(`npx eslint --fix ${filePath}`);
    stopSpinner();
    success('Arquivo analisado (ESLint).');
  } catch (error) {
    stopSpinner();
    warn(`ESLint finalizado (verifique a saída se houver erros): ${error.stderr || error.message}`);
  }
}

function displayFinalWarnings(): void {
  warn('\n⚠️ ATENÇÃO: Verifique o conteúdo da migração gerada!');
  warn('   - Certifique-se de que as queries apontam para o schema correto (core vs. ${schema}).');
  warn('   - Verifique se as substituições de schema foram feitas corretamente.');

  warn('\nExemplo esperado para "core":');
  warn('   await queryRunner.query(`ALTER TABLE "core"."users" ...`);');
  warn('\nExemplo esperado para "tenanted":');
  warn('   const { schema } = ...;');
  warn('   await queryRunner.query(`ALTER TABLE "${schema}"."users" ...`);');
}

function displayInitialWarnings(): void {
  warn(
    '\n⚠️ ATENÇÃO: Verifique se suas entitys estão corretas antes de iniciar a geração de migrações!',
  );
  warn('   - Para schemas não core, o decorator @entity não deve apontar para nenhum schema.');
  warn('   - Para schemas core, o decorator @entity deve apontar para o schema core.');
  warn('\nExemplo decorator esperado para "core":');
  warn('   @Entity({ name: "users", schema: "core" })');
  warn('\nExemplo decorator esperado para "tenanted":');
  warn('   @Entity({ name: "users" })');
}

// --- Main Execution ---

async function main() {
  try {
    const { response: environment } = await askQuestion('Tipo de ambiente (dev/test/prod)', [
      'dev',
      'test',
      'prod',
    ]);

    environmentType(environment);

    const { response } = await askQuestion('Tipo da migração (core/tenanted)', [
      'core',
      'tenanted',
    ]);
    const type = response as MigrationType;

    displayInitialWarnings();

    const proceed = await askQuestion('Você deseja continuar? (y/n)', ['y'], 'n');
    if (!proceed.continue) {
      console.log('Processo cancelado pelo usuário.');
      process.exit(0);
    }

    const dataSource = configureDataSource(type);

    const { upSqls, downSqls } = await generateMigrationQueries(dataSource, type);
    validateQueries(upSqls, downSqls, type);

    const timestamp = new Date().getTime();
    const migrationName = 'schema-update';
    const fileContent = getTemplate(migrationName, timestamp, upSqls, downSqls.reverse(), type);

    const fileName = `${timestamp}-${migrationName}.ts`;
    const filePath = join(__dirname, `./migrations/${type}`, fileName);

    const stopSpinner = createSpinner(`Escrevendo arquivo de migração: ${filePath}...`);
    try {
      await writeFile(filePath, fileContent);
      stopSpinner();
      success(`Arquivo de migração criado: ${filePath}`);
    } catch (error) {
      stopSpinner();
      errorLog(`Erro ao escrever arquivo: ${error.message}`);
      throw error;
    }

    await formatAndLintFile(filePath);

    displayFinalWarnings();

    process.exit(0);
  } catch (error) {
    errorLog(`\nProcesso falhou: ${error.message}`);
    process.exit(1);
  }
}

void main();

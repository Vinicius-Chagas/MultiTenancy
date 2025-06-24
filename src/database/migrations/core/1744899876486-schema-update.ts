import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1744899876486 implements MigrationInterface {
  name = 'SchemaUpdate1744899876486';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "core"."users" ADD "roleId" bigint NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "core"."users" ADD CONSTRAINT "FK_368e146b785b574f42ae9e53d5e" FOREIGN KEY ("roleId") REFERENCES "core"."roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."users" DROP CONSTRAINT "FK_368e146b785b574f42ae9e53d5e"`,
    );
    await queryRunner.query(`ALTER TABLE "core"."users" DROP COLUMN "roleId"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1744898995400 implements MigrationInterface {
  name = 'SchemaUpdate1744898995400';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "core"."permissions" ("id" BIGSERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "slug" character varying(15) NOT NULL, "description" character varying(255) NOT NULL, "deletedAt" TIMESTAMP, CONSTRAINT "UQ_d090ad82a0e97ce764c06c7b312" UNIQUE ("slug"), CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "core"."roles_status_enum" AS ENUM('active', 'inactive', 'pending', 'suspended')`,
    );
    await queryRunner.query(
      `CREATE TABLE "core"."roles" ("id" BIGSERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "description" character varying(255) NOT NULL, "deletedAt" TIMESTAMP, "status" "core"."roles_status_enum" NOT NULL DEFAULT 'active', CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "core"."role_permissions" ("role_id" bigint NOT NULL, "permission_id" bigint NOT NULL, CONSTRAINT "PK_25d24010f53bb80b78e412c9656" PRIMARY KEY ("role_id", "permission_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_178199805b901ccd220ab7740e" ON "core"."role_permissions" ("role_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_17022daf3f885f7d35423e9971" ON "core"."role_permissions" ("permission_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."role_permissions" ADD CONSTRAINT "FK_178199805b901ccd220ab7740ec" FOREIGN KEY ("role_id") REFERENCES "core"."roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."role_permissions" ADD CONSTRAINT "FK_17022daf3f885f7d35423e9971e" FOREIGN KEY ("permission_id") REFERENCES "core"."permissions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."role_permissions" DROP CONSTRAINT "FK_17022daf3f885f7d35423e9971e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."role_permissions" DROP CONSTRAINT "FK_178199805b901ccd220ab7740ec"`,
    );
    await queryRunner.query(`DROP INDEX "core"."IDX_17022daf3f885f7d35423e9971"`);
    await queryRunner.query(`DROP INDEX "core"."IDX_178199805b901ccd220ab7740e"`);
    await queryRunner.query(`DROP TABLE "core"."role_permissions"`);
    await queryRunner.query(`DROP TABLE "core"."roles"`);
    await queryRunner.query(`DROP TYPE "core"."roles_status_enum"`);
    await queryRunner.query(`DROP TABLE "core"."permissions"`);
  }
}

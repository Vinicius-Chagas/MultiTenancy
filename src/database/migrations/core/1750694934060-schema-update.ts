import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1750694934060 implements MigrationInterface {
  name = 'SchemaUpdate1750694934060';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "core"."workspaces_activationstatus_enum" AS ENUM('ONGOING_CREATION', 'PENDING_ACTIVATION', 'ACTIVE', 'INACTIVE', 'SUSPENDED', 'CANCELED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "core"."workspaces" ("id" BIGSERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "displayName" character varying(50) NOT NULL, "logoUrl" character varying(255), "workspaceMemberCount" integer NOT NULL DEFAULT '1', "activationStatus" "core"."workspaces_activationstatus_enum" NOT NULL DEFAULT 'ONGOING_CREATION', "databaseSchema" character varying(50) NOT NULL, "subdomain" character varying(120) NOT NULL, "customDomain" character varying(120) NOT NULL, "companyId" bigint NOT NULL, "deletedAt" TIMESTAMP, CONSTRAINT "UQ_518cf0e917667a39558bdd07b25" UNIQUE ("displayName"), CONSTRAINT "UQ_cf31c6e0f89669a1741c657f1fd" UNIQUE ("databaseSchema"), CONSTRAINT "UQ_38e2a4db8eff638ecd3efb063e4" UNIQUE ("subdomain"), CONSTRAINT "UQ_a92154598d9c25552a907989e37" UNIQUE ("customDomain"), CONSTRAINT "REL_537f5d2813c65121d535b33c15" UNIQUE ("companyId"), CONSTRAINT "PK_098656ae401f3e1a4586f47fd8e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "unique_cpf_active_users" ON "core"."users" ("cpf") WHERE "deletedAt" IS NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "unique_email_active_users" ON "core"."users" ("email") WHERE "deletedAt" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."workspaces" ADD CONSTRAINT "FK_537f5d2813c65121d535b33c154" FOREIGN KEY ("companyId") REFERENCES "core"."companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."workspaces" DROP CONSTRAINT "FK_537f5d2813c65121d535b33c154"`,
    );
    await queryRunner.query(`DROP INDEX "core"."unique_email_active_users"`);
    await queryRunner.query(`DROP INDEX "core"."unique_cpf_active_users"`);
    await queryRunner.query(`DROP TABLE "core"."workspaces"`);
    await queryRunner.query(`DROP TYPE "core"."workspaces_activationstatus_enum"`);
  }
}

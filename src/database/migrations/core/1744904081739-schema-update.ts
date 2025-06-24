import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1744904081739 implements MigrationInterface {
  name = 'SchemaUpdate1744904081739';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "core"."companies_type_enum" AS ENUM('PF', 'PJ')`);
    await queryRunner.query(
      `CREATE TABLE "core"."companies" ("id" BIGSERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "email" character varying(300) NOT NULL, "type" "core"."companies_type_enum" NOT NULL DEFAULT 'PJ', "document" character varying(20) NOT NULL, "telephone" character varying(20) NOT NULL, "cep" character varying(20) NOT NULL, "country" character varying(40) NOT NULL, "state" character varying(10) NOT NULL, "city" character varying(30) NOT NULL, "neighborhood" character varying(50) NOT NULL, "street" character varying(255) NOT NULL, "number" character varying(10) NOT NULL, "subdomain" character varying(255) NOT NULL, "deletedAt" TIMESTAMP, "createdById" bigint NOT NULL, CONSTRAINT "UQ_d0af6f5866201d5cb424767744a" UNIQUE ("email"), CONSTRAINT "UQ_13496c970093729e7ab04eb7da4" UNIQUE ("document"), CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."companies" ADD CONSTRAINT "FK_ff7919ef0e4b04801188c4aa591" FOREIGN KEY ("createdById") REFERENCES "core"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."companies" DROP CONSTRAINT "FK_ff7919ef0e4b04801188c4aa591"`,
    );
    await queryRunner.query(`DROP TABLE "core"."companies"`);
    await queryRunner.query(`DROP TYPE "core"."companies_type_enum"`);
  }
}

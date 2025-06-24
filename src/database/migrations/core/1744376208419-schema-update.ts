import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1744376208419 implements MigrationInterface {
  name = 'SchemaUpdate1744376208419';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "core"."users" ("id" BIGSERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "definePasswordPath" character varying(500),"password" character varying(255), "email" character varying(300) NOT NULL, "cpf" character varying(20) NOT NULL, "telephone" character varying(20) NOT NULL, "cep" character varying(20) NOT NULL,"country" character varying(40) NOT NULL, "state" character varying(10) NOT NULL, "city" character varying(30) NOT NULL, "neighborhood" character varying(50) NOT NULL, "street" character varying(255) NOT NULL, "number" character varying(10) NOT NULL, "refreshToken" character varying(1000), "passwordResetToken" character varying(10), "passwordResetTokenExpiresAt" TIMESTAMP, "twoFa" boolean NOT NULL DEFAULT false, "twoFASecret" character varying(255), "emailVerifiedAt" TIMESTAMP WITH TIME ZONE, "emailVerificationToken" character varying(30), "emailVerificationTokenExpiresAt" TIMESTAMP WITH TIME ZONE, "isActive" boolean NOT NULL DEFAULT true, "deletedAt" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_230b925048540454c8b4c481e1c" UNIQUE ("cpf"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "core"."users"`);
  }
}

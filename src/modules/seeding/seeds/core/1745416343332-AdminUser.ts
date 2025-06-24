import { genSalt, hash } from 'bcrypt';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AdminUserSeed1745416343332 implements MigrationInterface {
  name = 'AdminUserSeed1745416343332';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const salt = await genSalt(10);

    const password = await hash('Teste12!@', salt);

    const adminRole = await queryRunner.query(
      `SELECT id FROM "core"."roles" WHERE name = 'admin' LIMIT 1;`,
    );
    const userRole = await queryRunner.query(
      `SELECT id FROM "core"."roles" WHERE name = 'user' LIMIT 1;`,
    );
    const adminRoleId = adminRole.length > 0 ? adminRole[0].id : null;
    const userRoleId = userRole.length > 0 ? userRole[0].id : null;

    if (!adminRoleId) {
      throw new Error('Admin role not found. Please run the roles/permissions seed first.');
    }

    await queryRunner.query(
      `
      INSERT INTO "core"."users"
        (name, email, password, cpf, telephone, cep, country, state, city, neighborhood, street, number, "roleId", "isActive", "createdAt", "updatedAt", "twoFa")
      VALUES
        ('Administrador', 'admin@admin.com', $1, '97146324044', '0000000000', '00000000', 'Brasil', 'SP', 'São Paulo', 'Centro', 'Rua Admin', '1', $2, true, NOW(), NOW(), false),
        ('user', 'user@user.com', $1, '29003253072', '0000000000', '00000000', 'Brasil', 'SP', 'São Paulo', 'Centro', 'Rua Admin', '1', $3, true, NOW(), NOW(), false)
      ON CONFLICT (email) DO NOTHING;
      `,

      [password, Number(adminRoleId), Number(userRoleId)],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "core"."users" WHERE email = 'admin@admin.com';`);
    await queryRunner.query(`DELETE FROM "core"."users" WHERE email = 'user@user.com';`);
  }
}

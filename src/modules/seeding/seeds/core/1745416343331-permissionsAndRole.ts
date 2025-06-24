import { MigrationInterface, QueryRunner } from 'typeorm';

export class PermissionsAndRole1745416343331 implements MigrationInterface {
  name = 'PermissionsAndRole1745416343331';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "core"."permissions" ("name", "description", "slug") VALUES
      ('Empresas', 'Permissão de deleção para o módulo de companias.', 'd_empr'),
      ('Empresas', 'Permissão de escrita para o módulo de companias.', 'c_empr'),
      ('Empresas', 'Permissão de edição para o módulo de companias.', 'e_empr'),
      ('Planos', 'Permissão de edição para o módulo de planos.', 'e_plan'),
      ('Planos', 'Permissão de deleção para o módulo de planos.', 'd_plan'),
      ('Planos', 'Permissão de escrita para o módulo de planos.', 'c_plan'),
      ('Usuário', 'Permissão de deleção para o módulo de usuários.', 'd_usua'),
      ('Usuário', 'Permissão de escrita para o módulo de usuários.', 'c_usua'),
      ('Usuário', 'Permissão de edição para o módulo de usuários.', 'e_usua'),
      ('Template', 'Permissão de deleção para o módulo de templates.', 'd_temp'),
      ('Template', 'Permissão de escrita para o módulo de templates.', 'c_temp'),
      ('Template', 'Permissão de edição para o módulo de templates.', 'e_temp'),
      ('Nível de acesso', 'Permissão de deleção para o módulo de roles.', 'd_nive'),
      ('Nível de acesso', 'Permissão de escrita para o módulo de roles.', 'c_nive'),
      ('Nível de acesso', 'Permissão de edição para o módulo de roles.', 'e_nive')
      ON CONFLICT (slug) DO NOTHING; -- Optional: Prevent errors if slugs already exist
    `);

    await queryRunner.query(`
      INSERT INTO "core"."roles" ("name", "description") VALUES
      ('admin', 'Permissão de administrador.'),
      ('user', 'Permissão de usuário.')
      ON CONFLICT (name) DO NOTHING; -- Optional: Prevent errors if slug already exists
    `);

    await queryRunner.query(`
      INSERT INTO "core"."role_permissions" ("role_id", "permission_id")
      SELECT r.id, p.id
      FROM "core"."roles" r
      CROSS JOIN "core"."permissions" p
      WHERE r.name = 'admin'
      AND p.slug IN (
        'd_empr', 'c_empr', 'e_empr',
        'e_plan', 'd_plan', 'c_plan',
        'd_usua', 'c_usua', 'e_usua',
        'd_temp', 'c_temp', 'e_temp',
        'd_nive', 'c_nive', 'e_nive'
      )
      ON CONFLICT ("role_id", "permission_id") DO NOTHING; -- Optional: Prevent errors if links already exist
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const adminRole = await queryRunner.query(
      `SELECT id FROM "core"."roles" WHERE slug = 'admin' LIMIT 1;`,
    );
    const adminRoleId = adminRole.length > 0 ? adminRole[0].id : null;

    if (adminRoleId) {
      await queryRunner.query(`DELETE FROM "core"."role_permissions" WHERE "role_id" = $1;`, [
        adminRoleId,
      ]);
      await queryRunner.query(`DELETE FROM "core"."roles" WHERE "id" = $1;`, [adminRoleId]);
    }

    // Remove permissions
    await queryRunner.query(`
      DELETE FROM "core"."permissions" WHERE "slug" IN (
        'd_comp', 'c_comp', 'e_comp',
        'e_plan', 'd_plan', 'c_plan',
        'd_user', 'c_user', 'e_user',
        'd_temp', 'c_temp', 'e_temp',
        'd_role', 'c_role', 'e_role'
      );
    `);
  }
}

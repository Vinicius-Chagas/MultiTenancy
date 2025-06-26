import { OmitType, PickType } from '@nestjs/graphql';
import { Permission } from 'src/modules/permissions/permission.entity';
import { Role } from 'src/modules/roles/role.entity';
import { User } from 'src/modules/users/user.entity';

export class TokenPermissionDto extends PickType(Permission, ['slug']) {
  constructor(permission: Permission) {
    super();
    this.slug = permission.slug;
  }
}

export class TokenRoleDto extends PickType(Role, ['name']) {
  permissions: TokenPermissionDto[];
  constructor(role: Role) {
    super();
    this.permissions = Array.isArray(role.permissions)
      ? role.permissions.map((p) => new TokenPermissionDto(p))
      : [];
  }
}

export class TokenUserDto extends OmitType(User, [
  'companies',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'emailVerifiedAt',
  'passwordResetToken',
  'passwordResetTokenExpiresAt',
  'emailVerificationToken',
  'emailVerificationTokenExpiresAt',
  'twoFASecret',
  'definePasswordPath',
]) {
  role: TokenRoleDto;
  constructor(user: User) {
    super();
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.twoFa = user.twoFa;
    this.refreshToken = user.refreshToken ?? null;
    this.password = user.password;
    this.role = new TokenRoleDto(user.dashboardProfile?.role || new Role());
  }
}

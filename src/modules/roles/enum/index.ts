import { registerEnumType } from '@nestjs/graphql';

enum RoleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
}

registerEnumType(RoleStatus, { name: 'RoleStatus' });

export { RoleStatus };

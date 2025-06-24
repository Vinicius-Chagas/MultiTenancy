import { registerEnumType } from '@nestjs/graphql';

export enum WorkspaceActivationStatus {
  ONGOING_CREATION = 'ONGOING_CREATION',
  PENDING_ACTIVATION = 'PENDING_ACTIVATION',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  CANCELED = 'CANCELED',
}

registerEnumType(WorkspaceActivationStatus, {
  name: 'WorkspaceActivationStatus',
});

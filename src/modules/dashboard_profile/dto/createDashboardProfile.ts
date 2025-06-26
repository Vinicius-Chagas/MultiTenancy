import { InputType, OmitType } from '@nestjs/graphql';
import { DashboardProfile } from '../dashboard_profile.entity';

@InputType()
export class CreateDashboardProfileInput extends OmitType(
  DashboardProfile,
  ['id', 'createdAt', 'updatedAt'],
  InputType,
) {}

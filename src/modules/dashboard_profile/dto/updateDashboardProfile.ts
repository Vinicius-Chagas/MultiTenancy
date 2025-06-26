import { InputType, PartialType } from '@nestjs/graphql';
import { CreateDashboardProfileInput } from './createDashboardProfile';

@InputType()
export class UpdateDashboardProfileInput extends PartialType(CreateDashboardProfileInput) {}

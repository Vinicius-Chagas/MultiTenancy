import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateUserInput } from './createUserInput.dto';
import { UpdateDashboardProfileInput } from 'src/modules/dashboard_profile/dto/updateDashboardProfile';
import { IsOptional } from 'class-validator';

@InputType()
export class UpdateUserInput extends PartialType(OmitType(CreateUserInput, ['dashboardProfile'])) {
  @IsOptional()
  @Field(() => UpdateDashboardProfileInput, { nullable: true })
  dashboardProfile?: UpdateDashboardProfileInput;
}

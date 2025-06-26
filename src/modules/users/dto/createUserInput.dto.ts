import { Field, InputType, OmitType } from '@nestjs/graphql';
import { User } from '../user.entity';
import { CreateDashboardProfileInput } from 'src/modules/dashboard_profile/dto/createDashboardProfile';
import { IsOptional } from 'class-validator';

@InputType()
export class CreateUserInput extends OmitType(
  User,
  [
    'id',
    'createdAt',
    'updatedAt',
    'emailVerifiedAt',
    'passwordResetToken',
    'passwordResetTokenExpiresAt',
    'emailVerificationToken',
    'emailVerificationTokenExpiresAt',
    'twoFa',
    'twoFASecret',
    'refreshToken',
    'companies',
    'password',
    'definePasswordPath',
    'deletedAt',
    'dashboardProfile',
  ],
  InputType,
) {
  @IsOptional()
  @Field(() => CreateDashboardProfileInput, { nullable: true })
  dashboardProfile?: CreateDashboardProfileInput;
}

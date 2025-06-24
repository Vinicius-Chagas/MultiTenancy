import { InputType, OmitType } from '@nestjs/graphql';
import { User } from '../user.entity';

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
    'isActive',
    'twoFa',
    'twoFASecret',
    'refreshToken',
    'role',
    'companies',
    'password',
    'definePasswordPath',
    'deletedAt',
  ],
  InputType,
) {}

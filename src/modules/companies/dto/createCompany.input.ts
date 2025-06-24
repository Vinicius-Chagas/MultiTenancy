import { InputType, OmitType } from '@nestjs/graphql';
import { Company } from '../company.entity';

@InputType()
export class CreateCompanyInput extends OmitType(
  Company,
  ['id', 'createdAt', 'updatedAt', 'createdBy'],
  InputType,
) {}

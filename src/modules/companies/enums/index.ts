import { registerEnumType } from '@nestjs/graphql';

export enum CompanyType {
  PF = 'PF',
  PJ = 'PJ',
}

registerEnumType(CompanyType, { name: 'CompanyType' });

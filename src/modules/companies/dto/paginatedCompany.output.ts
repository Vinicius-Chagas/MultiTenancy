import { ObjectType } from '@nestjs/graphql';
import { PaginatedResponse } from 'src/shared/dto/paginationOutput.dto';
import { Company } from '../company.entity';

@ObjectType()
export class paginatedCompany extends PaginatedResponse(Company) {}

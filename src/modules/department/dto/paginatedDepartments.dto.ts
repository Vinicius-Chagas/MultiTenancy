import { ObjectType } from '@nestjs/graphql';
import { PaginatedResponse } from 'src/shared/dto/paginationOutput.dto';
import { Department } from '../department.entity';

@ObjectType()
export class PaginatedDepartments extends PaginatedResponse(Department) {}

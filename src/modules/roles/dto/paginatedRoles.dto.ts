import { ObjectType } from '@nestjs/graphql';
import { PaginatedResponse } from 'src/shared/dto/paginationOutput.dto';
import { Role } from '../role.entity';

@ObjectType()
export class PaginatedRoles extends PaginatedResponse(Role) {}

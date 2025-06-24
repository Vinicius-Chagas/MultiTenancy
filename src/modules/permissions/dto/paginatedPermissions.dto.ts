import { ObjectType } from '@nestjs/graphql';
import { PaginatedResponse } from 'src/shared/dto/paginationOutput.dto';
import { Permission } from '../permission.entity';

@ObjectType()
export class PaginatedPermissions extends PaginatedResponse(Permission) {}

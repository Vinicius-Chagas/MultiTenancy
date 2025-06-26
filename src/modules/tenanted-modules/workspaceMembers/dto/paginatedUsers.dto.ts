import { ObjectType } from '@nestjs/graphql';
import { PaginatedResponse } from 'src/shared/dto/paginationOutput.dto';
import { User } from '../workspaceMember';

@ObjectType()
export class Paginatedusers extends PaginatedResponse(User) {}

import { Field, Int, ObjectType, PickType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { Min } from 'class-validator';
import { PaginationInput } from './paginationInput.dto';

@ObjectType()
export class MetaDataOutput extends PickType(PaginationInput, ['page', 'limit'], ObjectType) {
  @Field(() => Int, { defaultValue: 1, nullable: true })
  @Min(0)
  @Type(() => Number)
  totalPages: number;

  @Field(() => Int, { defaultValue: 0, nullable: true })
  @Type(() => Number)
  totalCount: number;
}

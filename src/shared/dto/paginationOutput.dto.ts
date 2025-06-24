import { Field, ObjectType } from '@nestjs/graphql';
import { ValidateNested } from 'class-validator';
import { MetaDataOutput } from './metaDataOutput.dto';
import { Type } from 'class-transformer';
import { Type as ClassRef } from '@nestjs/common';

export function PaginatedResponse<T>(classRef: ClassRef<T>) {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedResponseClass {
    @Field(() => [classRef])
    items: T[];

    @Field(() => MetaDataOutput)
    @ValidateNested()
    @Type(() => MetaDataOutput)
    meta: MetaDataOutput;
  }
  return PaginatedResponseClass;
}

import { Field, InputType, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class PaginationInput {
  @Field(() => Int, { defaultValue: 1, nullable: true })
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @Field(() => Int, { defaultValue: 10, nullable: true })
  @Min(10)
  @Type(() => Number)
  limit: number = 10;

  @Field(() => String, { defaultValue: null, nullable: true })
  search: string | null;

  @Field(() => String, { defaultValue: 'ASC', nullable: true })
  order: 'ASC' | 'DESC' = 'ASC';

  paginate() {
    const pag = this.page - 1 < 0 ? 0 : this.page - 1;
    const skip = pag * this.limit;
    return {
      take: this.limit,
      skip,
    };
  }
}

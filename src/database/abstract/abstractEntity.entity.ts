import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
export abstract class AbstractEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  @IsNotEmpty({ message: 'ID é obrigatório.' })
  id: number;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt: Date;
}

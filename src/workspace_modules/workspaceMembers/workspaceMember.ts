import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { AbstractEntity } from 'src/database/abstract/abstractEntity.entity';
import { Column, DeleteDateColumn, Entity, Index } from 'typeorm';

@Entity({ name: 'workspace_members' })
@ObjectType()
@Index('userId', ['userId'], { where: '"deletedAt" IS NULL', unique: true })
export class workspaceMember extends AbstractEntity {
  @DeleteDateColumn()
  @Field(() => Date, { nullable: true })
  deletedAt: Date | null;

  @Column({ type: 'int', unsigned: true })
  @IsNumber({}, { message: 'userId deve ser um número.' })
  @IsNotEmpty({ message: 'userId é obrigatório.' })
  @Field(() => Number)
  userId: number;

  @Column({ type: 'int', unsigned: true })
  @IsNumber({}, { message: 'departmentId deve ser um número.' })
  @IsNotEmpty({ message: 'departmentId é obrigatório.' })
  @Field(() => Number)
  departmentId: number;
}

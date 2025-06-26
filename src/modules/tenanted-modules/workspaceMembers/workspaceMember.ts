import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { AbstractEntity } from 'src/database/abstract/abstractEntity.entity';
import { Column, DeleteDateColumn, Entity, Index } from 'typeorm';

@Entity({ name: 'users', schema: 'core' })
@ObjectType()
@Index('unique_email_active_users', ['email'], { where: '"deletedAt" IS NULL', unique: true })
@Index('unique_cpf_active_users', ['cpf'], { where: '"deletedAt" IS NULL', unique: true })
export class workspaceMembers extends AbstractEntity {
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

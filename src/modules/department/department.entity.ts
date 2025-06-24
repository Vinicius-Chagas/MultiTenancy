import { Field, ObjectType } from '@nestjs/graphql';
import { Column, DeleteDateColumn, Entity } from 'typeorm';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { AbstractEntity } from 'src/database/abstract/abstractEntity.entity';

@Entity({ name: 'department' })
@ObjectType()
export class Department extends AbstractEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  @IsNotEmpty({ message: 'Nome é obrigatório.' })
  @IsString({ message: 'Nome deve ser uma string.' })
  @Field()
  name: string;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty({ message: 'Descrição é obrigatória.' })
  @IsString({ message: 'Descrição deve ser uma string.' })
  @Length(1, 255, { message: 'Descrição deve ter no máximo 255 caracteres.' })
  @Field()
  description: string;

  @DeleteDateColumn()
  deletedAt: Date | null;
}

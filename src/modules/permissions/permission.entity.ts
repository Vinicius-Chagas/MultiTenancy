import { Field, ObjectType } from '@nestjs/graphql';
import { Column, DeleteDateColumn, Entity, ManyToMany } from 'typeorm';
import { Role } from '../roles/role.entity';
import { AbstractEntity } from 'src/database/abstract/abstractEntity.entity';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@Entity({ name: 'permissions', schema: 'core' })
@ObjectType()
export class Permission extends AbstractEntity {
  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty({ message: 'Nome é obrigatório.' })
  @IsString({ message: 'Nome deve ser uma string.' })
  @Field()
  name: string;

  @Column({ type: 'varchar', length: 15, unique: true })
  @IsNotEmpty({ message: 'Slug é obrigatória.' })
  @IsString({ message: 'Slug deve ser uma string.' })
  @Length(1, 10, { message: 'Slug deve ter no máximo 10 caracteres.' })
  @Field()
  slug: string;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty({ message: 'Descrição é obrigatória.' })
  @IsString({ message: 'Descrição deve ser uma string.' })
  @Length(1, 255, { message: 'Descrição deve ter no máximo 255 caracteres.' })
  @Field()
  description: string;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToMany(() => Role, (r) => r.permissions)
  @Field(() => [Role])
  roles: Role[];
}

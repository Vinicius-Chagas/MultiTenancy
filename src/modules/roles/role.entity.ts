import { Field, ObjectType } from '@nestjs/graphql';
import { Column, DeleteDateColumn, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Permission } from '../permissions/permission.entity';
import { RoleStatus } from './enum';
import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { AbstractEntity } from 'src/database/abstract/abstractEntity.entity';
import { DashboardProfile } from '../dashboard_profile/dashboard_profile.entity';

@Entity({ name: 'roles', schema: 'core' })
@ObjectType()
export class Role extends AbstractEntity {
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

  @Column({ type: 'enum', enum: RoleStatus, default: RoleStatus.ACTIVE })
  @IsEnum(RoleStatus)
  @Field(() => RoleStatus)
  status: RoleStatus;

  @ManyToMany(() => Permission, (p) => p.roles, { cascade: ['insert', 'remove', 'update'] })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
    schema: 'core',
  })
  @Field(() => [Permission])
  permissions: Permission[];

  @OneToMany(() => DashboardProfile, (d) => d.role)
  @Field(() => [DashboardProfile])
  dashboardProfile: DashboardProfile[];
}

import { Field, ObjectType } from '@nestjs/graphql';
import { Column, DeleteDateColumn, Entity, JoinColumn, OneToOne } from 'typeorm';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { AbstractEntity } from 'src/database/abstract/abstractEntity.entity';
import { Type } from 'class-transformer';
import { Company } from '../companies/company.entity';
import { WorkspaceActivationStatus } from './enums';

@Entity({ name: 'workspaces', schema: 'core' })
@ObjectType()
export class Workspace extends AbstractEntity {
  @Column({ type: 'varchar', length: 50, unique: true })
  @IsString({ message: 'displayName deve ser uma string.' })
  @IsNotEmpty({ message: 'displayName é obrigatório.' })
  @Field()
  displayName: string;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  @IsOptional()
  @IsString({ message: 'logoUrl deve ser uma string.' })
  @IsNotEmpty({ message: 'logoUrl é obrigatório.' })
  @Field({ nullable: true, defaultValue: null })
  logoUrl: string;

  @Column({ type: 'int', default: 1 })
  @IsNumber({}, { message: 'Workspace member count deve ser um número.' })
  @IsOptional()
  @Field(() => Number, { defaultValue: 1 })
  @Type(() => Number)
  workspaceMemberCount: number;

  @Column({
    type: 'enum',
    enum: WorkspaceActivationStatus,
    default: WorkspaceActivationStatus.ONGOING_CREATION,
  })
  @IsNotEmpty({ message: 'activationStatus é obrigatório.' })
  @IsEnum(WorkspaceActivationStatus)
  @Field(() => WorkspaceActivationStatus)
  activationStatus: WorkspaceActivationStatus;

  @Column({ type: 'varchar', length: 50, unique: true })
  @IsString({ message: 'databaseSchema deve ser uma string.' })
  @IsNotEmpty({ message: 'databaseSchema é obrigatório.' })
  @Field()
  databaseSchema: string;

  @Column({ type: 'varchar', length: 120, unique: true })
  @IsString({ message: 'subdomain deve ser uma string.' })
  @IsNotEmpty({ message: 'subdomain é obrigatório.' })
  @Field()
  subdomain: string;

  @Column({ type: 'varchar', length: 120, unique: true })
  @IsString({ message: 'customDomain deve ser uma string.' })
  @IsNotEmpty({ message: 'customDomain é obrigatório.' })
  @Field()
  customDomain: string;

  @Column({ type: 'int', unsigned: true })
  @IsNumber({}, { message: 'companyId deve ser um número.' })
  @IsNotEmpty({ message: 'companyId é obrigatório.' })
  @Field(() => Number)
  companyId: number;

  @OneToOne(() => Company)
  @JoinColumn({ name: 'companyId', referencedColumnName: 'id' })
  company: Company;

  @DeleteDateColumn()
  deletedAt: Date;
}

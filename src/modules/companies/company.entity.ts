import { Field, ObjectType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { AbstractEntity } from 'src/database/abstract/abstractEntity.entity';
import { IsValidCPFOrCNPJ } from 'src/shared/decorators/isValidCPFOrCNPJ.decorator';
import { UnformatNumbers } from 'src/shared/decorators/unformatNumbers';
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { CompanyType } from './enums';

@Entity({ name: 'companies', schema: 'core' })
@ObjectType()
export class Company extends AbstractEntity {
  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty({ message: 'Nome é obrigatório.' })
  @IsString({ message: 'Nome deve ser uma string.' })
  @Field()
  name: string;

  @Column({ type: 'varchar', length: 300, unique: true })
  @IsNotEmpty({ message: 'E-mail é obrigatório.' })
  @IsString({ message: 'Email deve ser uma string.' })
  @Field()
  email: string;

  @Column({ type: 'enum', enum: CompanyType, default: CompanyType.PJ })
  @IsNotEmpty({ message: 'Tipo de empresa é obrigatório.' })
  @IsEnum(CompanyType, { message: 'Tipo de empresa inválido.' })
  @Field(() => CompanyType)
  type: CompanyType;

  @Column({ type: 'varchar', length: 20, unique: true })
  @IsNotEmpty({ message: 'Document é obrigatório.' })
  @IsString({ message: 'Document deve ser uma string.' })
  @IsValidCPFOrCNPJ('ANY', { message: 'Document inválido.' })
  @UnformatNumbers()
  @Field()
  document: string;

  @Column({ type: 'varchar', length: 20 })
  @IsNotEmpty({ message: 'Telefone é obrigatório.' })
  @IsString({ message: 'Telefone deve ser uma string.' })
  @UnformatNumbers()
  @Field()
  telephone: string;

  @Column({ type: 'varchar', length: 20 })
  @IsNotEmpty({ message: 'CEP é obrigatório.' })
  @IsString({ message: 'CEP deve ser uma string.' })
  @UnformatNumbers()
  @Field()
  cep: string;

  @Column({ type: 'varchar', length: 40 })
  @IsNotEmpty({ message: 'País é obrigatório.' })
  @IsString({ message: 'País deve ser uma string.' })
  @Field()
  country: string;

  @Column({ type: 'varchar', length: 10 })
  @IsNotEmpty({ message: 'Estado é obrigatório.' })
  @IsString({ message: 'Estado deve ser uma string.' })
  @Field()
  state: string;

  @Column({ type: 'varchar', length: 30 })
  @IsNotEmpty({ message: 'Cidade é obrigatório.' })
  @IsString({ message: 'Cidade deve ser uma string.' })
  @Field()
  city: string;

  @Column({ type: 'varchar', length: 50 })
  @IsNotEmpty({ message: 'Bairro é obrigatório.' })
  @IsString({ message: 'Bairro deve ser uma string.' })
  @Field()
  neighborhood: string;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty({ message: 'Rua é obrigatório.' })
  @IsString({ message: 'Rua deve ser uma string.' })
  @Field()
  street: string;

  @Column({ type: 'varchar', length: 10 })
  @IsNotEmpty({ message: 'Número é obrigatório.' })
  @IsString({ message: 'Número deve ser uma string.' })
  @Field()
  number: string;

  @Column({ type: 'varchar', length: 255 })
  @IsString({ message: 'subdomain deve ser uma string.' })
  @Field()
  subdomain: string;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @Column({ type: 'int', unsigned: true })
  @IsNumber({}, { message: 'createdById deve ser um número.' })
  @IsNotEmpty({ message: 'createdById é obrigatório.' })
  @Field(() => Number)
  createdById: number;

  @ManyToOne(() => User, (u) => u.companies)
  @JoinColumn({ name: 'createdById', referencedColumnName: 'id' })
  @Field(() => User)
  createdBy: User;
}

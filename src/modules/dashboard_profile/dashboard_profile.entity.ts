import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { AbstractEntity } from 'src/database/abstract/abstractEntity.entity';
import { UnformatNumbers } from 'src/shared/decorators/unformatNumbers';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity({ name: 'dashboard_profile', schema: 'core' })
@ObjectType()
export class DashboardProfile extends AbstractEntity {
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

  @Column({ type: 'int', nullable: true })
  @Field(() => Number)
  @IsNotEmpty({ message: 'ID do usuário é obrigatório.' })
  userId: number;

  @OneToOne(() => User, (u) => u.dashboardProfile, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;
}

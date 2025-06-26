import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AbstractEntity } from 'src/database/abstract/abstractEntity.entity';
import { IsValidCPFOrCNPJ } from 'src/shared/decorators/isValidCPFOrCNPJ.decorator';
import { UnformatNumbers } from 'src/shared/decorators/unformatNumbers';
import { Column, DeleteDateColumn, Entity, Index, OneToMany, OneToOne } from 'typeorm';
import { Company } from '../companies/company.entity';
import { DashboardProfile } from '../dashboard_profile/dashboard_profile.entity';

@Entity({ name: 'users', schema: 'core' })
@ObjectType()
@Index('unique_email_active_users', ['email'], { where: '"deletedAt" IS NULL', unique: true })
@Index('unique_cpf_active_users', ['cpf'], { where: '"deletedAt" IS NULL', unique: true })
export class User extends AbstractEntity {
  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty({ message: 'Nome é obrigatório.' })
  @IsString({ message: 'Nome deve ser uma string.' })
  @Field()
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsNotEmpty({ message: 'Senha é obrigatória.' })
  @IsString({ message: 'Senha deve ser uma string.' })
  @IsOptional()
  @Field({ nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 300, unique: true })
  @IsNotEmpty({ message: 'E-mail é obrigatório.' })
  @IsString({ message: 'Email deve ser uma string.' })
  @Field()
  email: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  @IsNotEmpty({ message: 'CPF é obrigatório.' })
  @IsString({ message: 'CPF deve ser uma string.' })
  @IsValidCPFOrCNPJ('CPF', { message: 'CPF inválido.' })
  @UnformatNumbers()
  @Field()
  cpf: string;

  @Column({ type: 'varchar', length: 1000, nullable: true, default: null })
  refreshToken: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true, default: null })
  definePasswordPath: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true, default: null })
  passwordResetToken: string | null;

  @Column({ type: 'timestamp', nullable: true, default: null })
  passwordResetTokenExpiresAt: Date | null;

  @Column({ type: 'boolean', default: false })
  @Field(() => Boolean, { defaultValue: false })
  twoFa: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  twoFASecret: string;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  emailVerifiedAt: Date | null;

  @Column({ type: 'varchar', nullable: true, default: null, length: 30 })
  emailVerificationToken: string | null;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  emailVerificationTokenExpiresAt: Date | null;

  @DeleteDateColumn()
  @Field(() => Date, { nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Company, (c) => c.createdBy)
  @Field(() => [Company])
  companies: Company[];

  @OneToOne(() => DashboardProfile, (d) => d.user, { cascade: true, eager: true, nullable: true })
  @Field(() => DashboardProfile, { nullable: true })
  dashboardProfile?: DashboardProfile;
}

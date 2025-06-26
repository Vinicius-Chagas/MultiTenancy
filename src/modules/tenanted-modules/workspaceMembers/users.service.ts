/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './workspaceMember';
import { BaseRepository } from 'src/database/base-repository';
import { QueryOptimizerService } from '../QueryOptimizer/queryoptimizer.service';
import { GraphQLResolveInfo } from 'graphql';
import { UpdateUserInput } from './dto/updateUserInput.dto';
import { CreateUserInput } from './dto/createUserInput.dto';
import { addHours } from 'date-fns';
import { PaginationInput } from 'src/shared/dto/paginationInput.dto';
import { CustomErrors } from 'src/shared/errors/customErrors';
import { Paginatedusers } from './dto/paginatedUsers.dto';
import { SetUp2FAInput } from './dto/setUp2FAInput.dto';
import { TransportStrategyBuilder } from '../TwoFactorModule/TransportStrategyBuilder';
import { Setup2FAOutput } from '../auth/dtos/setup2FAOutput.dto';
import { MailBuilderFactory } from '../mail/mail.factory';
import { definePasswordInput } from './dto/definePasswordInput.dto';
import { randomUUID } from 'crypto';
import { genSalt, hash } from 'bcrypt';
import { RoleService } from '../roles/role.service';
import { TokenUserDto } from 'src/shared/dto/tokenUserOutput.dto';
import { In } from 'typeorm';

@Injectable()
export class UsersService {
  private errorHandler = new CustomErrors('user');
  constructor(
    @InjectRepository(User) private usersRepository: BaseRepository<User>,
    private queryOptimizer: QueryOptimizerService,
    private readonly transportStrategyBuilder: TransportStrategyBuilder,
    private readonly mailBuilderFactory: MailBuilderFactory,
    private readonly rolesService: RoleService,
  ) {}

  async findAll(paginate: PaginationInput, info: GraphQLResolveInfo): Promise<Paginatedusers> {
    return this.errorHandler.handleServiceMethod(async () => {
      const opt = this.queryOptimizer.generateOptimization(info);
      const sepulturas = await this.usersRepository.find({ ...opt, ...paginate.paginate() });
      const count = await this.usersRepository.count();
      return {
        items: sepulturas,
        meta: {
          limit: paginate.limit,
          page: paginate.page,
          totalCount: count,
          totalPages: Math.ceil(count / paginate.limit),
        },
      };
    });
  }

  async findOne(id: number, info?: GraphQLResolveInfo): Promise<User> {
    return this.errorHandler.handleServiceMethod(async () => {
      const opt = this.queryOptimizer.generateOptimization(info);
      const user = await this.usersRepository.findOne({
        where: { id },
        ...opt,
        relations: {
          role: {
            permissions: true,
          },
        },
      });

      if (!user) {
        throw this.errorHandler.notFound(id);
      }

      return user;
    });
  }

  async findOneByEmail(email: string): Promise<TokenUserDto> {
    return this.errorHandler.handleServiceMethod(async () => {
      const user = await this.usersRepository.findOne({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          twoFa: true,
          refreshToken: true,
          password: true,
        },
        relations: {
          role: {
            permissions: true,
          },
        },
      });

      if (!user) {
        throw this.errorHandler.notFound(1, `Usuário com email ${email} não encontrado`);
      }

      return new TokenUserDto(user);
    });
  }

  async findOneByToken(token: string): Promise<User> {
    return this.errorHandler.handleServiceMethod(async () => {
      const user = await this.usersRepository.findOne({ where: { passwordResetToken: token } });
      if (!user) {
        throw this.errorHandler.notFound(1, `Usuário com token ${token} não encontrado`);
      }

      return user;
    });
  }

  async findOneByDefinePasswordPath(path: string, info?: GraphQLResolveInfo): Promise<User> {
    return this.errorHandler.handleServiceMethod(async () => {
      const select = this.queryOptimizer.generateOptimization(info);
      const user = await this.usersRepository.findOne({
        where: { definePasswordPath: path },
        ...select,
      });
      if (!user) {
        throw this.errorHandler.notFound(1, `Usuário com path ${path} não encontrado`);
      }
      return user;
    });
  }

  async setup2FA({ twoFAType, userId }: SetUp2FAInput): Promise<Setup2FAOutput> {
    return this.errorHandler.handleServiceMethod(async () => {
      return await this.transportStrategyBuilder.build(twoFAType).setUp(userId);
    }, 'retrow');
  }

  async duplicatedUser(email: string, cpf: string): Promise<boolean> {
    return this.errorHandler.handleServiceMethod(async () => {
      const exists = await this.usersRepository.exists({
        where: [{ email: email.trim() }, { cpf: cpf.trim() }],
      });
      if (exists) {
        throw this.errorHandler.duplicateError(1, 'Usuário já cadastrado com esse email ou CPF');
      }
      return exists;
    });
  }

  async create(user: CreateUserInput): Promise<User> {
    return this.errorHandler.handleServiceMethod(async () => {
      const definePasswordPath = randomUUID();
      const newUser = this.usersRepository.create({ ...user, definePasswordPath });
      const createdUser = await this.usersRepository.save(newUser);
      await this.mailBuilderFactory
        .create()
        .setRecipient(user.email)
        .setSubject('Nova senha')
        .setTemplate('newPassword')
        .setContext({
          name: user.name,
          domain: process.env.FRONTEND_URL + '/users/password/' + definePasswordPath,
        })
        .send();

      return createdUser;
    }, 'create');
  }

  async definePassword({ password, id }: definePasswordInput): Promise<boolean> {
    return this.errorHandler.handleServiceMethod(async () => {
      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);
      await this.usersRepository.update(id, { password: hashedPassword, definePasswordPath: null });
      return true;
    });
  }

  async delete(id: number): Promise<void> {
    return this.errorHandler.handleServiceMethod(async () => {
      await this.ensureUserExists(id);
      await this.usersRepository.softDelete({ id });
    }, 'delete');
  }

  async deleteMany(ids: number[]): Promise<void> {
    return this.errorHandler.handleServiceMethod(async () => {
      const exists = await this.usersRepository.existsBy({ id: In(ids) });
      if (!exists) {
        throw this.errorHandler.notFound(1, ids.join(', '));
      }
      await this.usersRepository.softDelete(ids);
    }, 'delete');
  }

  async updateRefreshToken(id: number, refreshToken: string): Promise<void> {
    return this.errorHandler.handleServiceMethod(async () => {
      await this.usersRepository.update(id, { refreshToken });
    }, 'update');
  }

  async updateResetPasswordToken(id: number, token: string | null): Promise<void> {
    return this.errorHandler.handleServiceMethod(async () => {
      await this.usersRepository.update(id, {
        passwordResetToken: token,
        passwordResetTokenExpiresAt: addHours(new Date(), 2),
      });
    }, 'update');
  }

  async updatePassword(id: number, password: string): Promise<void> {
    return this.errorHandler.handleServiceMethod(async () => {
      await this.ensureUserExists(id);
      await this.usersRepository.update(id, { password, passwordResetToken: null });
    }, 'update');
  }

  async update(id: number, user: UpdateUserInput): Promise<void> {
    return this.errorHandler.handleServiceMethod(async () => {
      await this.ensureUserExists(id);
      await this.usersRepository.update(id, user);
    }, 'update');
  }

  private async ensureUserExists(id: number): Promise<void> {
    const exists = await this.usersRepository.exists({ where: { id } });
    if (!exists) {
      throw this.errorHandler.notFound(id);
    }
  }
}

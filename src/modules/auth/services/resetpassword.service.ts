/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { MailBuilderFactory } from 'src/modules/mail/mail.factory';
import { UsersService } from 'src/modules/users/users.service';
import { generateToken } from 'src/utils/generateToken';
import * as bcrypt from 'bcrypt';
import { isBefore } from 'date-fns';
import { ValidateTokenOutput } from '../dtos/validateTokenOutput.dto';

@Injectable()
export class ResetPasswordService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailBuilderFactory: MailBuilderFactory,
  ) {}

  async forgotPassword(email: string): Promise<string> {
    try {
      const user = await this.usersService.findOneByEmail(email);
      const token = generateToken();

      await this.usersService.updateResetPasswordToken(user.id, token);

      await this.mailBuilderFactory
        .create()
        .setRecipient(email)
        .setSubject('Recuperação de Senha')
        .setTemplate('forgotPassword')
        .setContext({ name: user.name, token })
        .send();
      return 'Email enviado com sucesso';
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        error.message || 'Erro ao enviar email de recuperação de senha.',
      );
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<string> {
    try {
      const user = await this.usersService.findOneByToken(token);
      if (
        !user ||
        !user.passwordResetTokenExpiresAt ||
        isBefore(user.passwordResetTokenExpiresAt, new Date())
      ) {
        throw new UnauthorizedException('Token de recuperação inválido ou expirado');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await this.usersService.updatePassword(user.id, hashedPassword);
      return 'Senha atualizada com sucesso';
    } catch (error) {
      console.error(error);
      return error.message;
    }
  }

  async validateToken(token: string): Promise<ValidateTokenOutput> {
    try {
      const user = await this.usersService.findOneByToken(token);
      if (
        !user ||
        !user.passwordResetTokenExpiresAt ||
        isBefore(user.passwordResetTokenExpiresAt, new Date())
      ) {
        throw new UnauthorizedException('Token de recuperação inválido ou expirado');
      }
      return { isValid: true };
    } catch (error) {
      console.error(error.message);
      return {
        isValid: false,
        error: (error as UnauthorizedException).message,
      };
    }
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePasswords(plainText: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashed);
  }
}

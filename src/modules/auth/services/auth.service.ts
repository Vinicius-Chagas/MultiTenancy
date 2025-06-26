/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInInput } from '../dtos/signInInput.dto';
import { CreateUserInput } from '../../users/dto/createUserInput.dto';
import { SignInOutput } from '../dtos/signInOutput.dto';
import { TokenService } from './token.service';
import { CustomErrors } from 'src/shared/errors/customErrors';
import { UsersService } from 'src/modules/users/users.service';
import { compare } from 'bcrypt';
import { TransportStrategyBuilder } from 'src/modules/TwoFactorModule/TransportStrategyBuilder';
import { twoFAInput } from 'src/modules/TwoFactorModule/dtos/2FAInput.dto';
import { omit } from 'lodash';
import { TokenUserDto } from 'src/shared/dto/tokenUserOutput.dto';

@Injectable()
export class AuthService {
  private errorHandler = new CustomErrors('AuthService');

  constructor(
    private transportStrategyBuilder: TransportStrategyBuilder,
    private tokenService: TokenService,
    private usersService: UsersService,
  ) {}

  async signIn({ email, password }: SignInInput): Promise<SignInOutput> {
    return this.errorHandler.handleServiceMethod(async () => {
      const user = await this.validateCredentials(email, password);

      console.log('user:', user);

      if (user.twoFa) {
        const twoFAToken = await this.tokenService.generateTemporary2FAToken({
          userId: user.id,
          twoFAType: 'googleAuthenticator',
        });

        return { requiresTwoFactor: true, twoFAToken, refresh_token: null, token: null };
      }

      const ommitedUser = omit(user, ['password', 'refreshToken']);

      console.log('ommitedUser:', ommitedUser);

      const tokens = await this.tokenService.generateAuthTokens({ user: ommitedUser });

      return tokens;
    });
  }

  async verify2FA(twoFA: twoFAInput): Promise<SignInOutput> {
    return this.errorHandler.handleServiceMethod(async () => {
      const { userId, twoFAType } = await this.tokenService.verifyTemporary2FAToken(
        twoFA.twoFAToken,
      );

      const user = await this.usersService.findOne(userId);

      const isValid = this.transportStrategyBuilder.build(twoFAType).verify(user, twoFA.authToken);
      if (!isValid) {
        throw this.errorHandler.unauthorized('Código 2FA inválido');
      }

      const userToken = new TokenUserDto(user);

      const ommitedUser = omit(userToken, ['password', 'refreshToken']);

      const tokens = await this.tokenService.generateAuthTokens({ user: ommitedUser });

      return tokens;
    });
  }

  private async validateCredentials(email: string, password: string): Promise<TokenUserDto> {
    const user = await this.usersService.findOneByEmail(email);

    console.log('validateCredentials - user:', user.role.permissions);

    if (!user) {
      throw this.errorHandler.notFound(1, 'Usuário não encontrado');
    }
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha inválida.');
    }

    return user;
  }

  private async verifyDuplicatedUser(user: CreateUserInput) {
    const userExists = await this.usersService.duplicatedUser(user.email, user.cpf);
    if (userExists) {
      throw this.errorHandler.duplicateError(1, 'Usuário já existe');
    }
  }
}

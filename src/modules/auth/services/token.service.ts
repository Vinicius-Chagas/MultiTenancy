/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import { ValidateTokenOutput } from '../dtos/validateTokenOutput.dto';
import { SignInOutput } from '../dtos/signInOutput.dto';
import { omit } from 'lodash';
import { TokenUserDto } from 'src/shared/dto/tokenUserOutput.dto';
@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async generateAuthTokens(payload: {
    user: Omit<TokenUserDto, 'password' | 'refreshToken'>;
  }): Promise<SignInOutput> {
    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: Number(process.env.JWT_REFRESH_SECONDS_EXPIRE),
      secret: process.env.JWT_REFRESH_SECRET,
    });

    await this.usersService.updateRefreshToken(payload.user.id, refresh_token);

    const token = await this.jwtService.signAsync(payload);

    console.log('payload.user:', payload.user);

    return {
      refresh_token,
      token,
      requiresTwoFactor: null,
      twoFAToken: null,
    };
  }

  async validateToken(token: string): Promise<ValidateTokenOutput> {
    try {
      await this.jwtService.verifyAsync(token);
      return { isValid: true };
    } catch (error) {
      console.error(error);
      return { isValid: false, error: error.message };
    }
  }

  async refreshToken(token: string): Promise<SignInOutput> {
    const { user } = await this.jwtService.verifyAsync<{
      user: TokenUserDto;
    }>(token, {
      secret: process.env.JWT_REFRESH_SECRET,
    });

    const foundUser = await this.usersService.findOneByEmail(user.email);
    if (!foundUser.refreshToken || foundUser.refreshToken !== token) {
      throw new Error('Refresh token inválido.');
    }
    const ommitedUser = omit(foundUser, ['password', 'refreshToken']);
    return this.generateAuthTokens({ user: ommitedUser });
  }

  async generateTemporary2FAToken(payload: { userId: number; twoFAType: string }): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: '5m',
      secret: process.env.JWT_2FA_SECRET,
    });
  }

  async verifyTemporary2FAToken(
    token: string,
  ): Promise<{ userId: number; twoFAType: 'googleAuthenticator' }> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_2FA_SECRET,
      });
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid or expired 2FA token');
    }
  }
}

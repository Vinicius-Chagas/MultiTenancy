/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { TokenUserDto } from 'src/shared/dto/tokenUserOutput.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    const JWT_SECRET = configService.get<string | undefined>('JWT_SECRET');
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in the environment variables');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  validate(payload: { user: TokenUserDto; iat: number; exp: number }): TokenUserDto {
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    console.log('JWT Expiration (UTC):', new Date(payload.exp * 1000).toISOString());
    console.log('Current Time (UTC):', new Date(currentTime * 1000).toISOString());
    return payload.user;
  }
}

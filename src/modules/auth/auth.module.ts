/*
https://docs.nestjs.com/modules
*/

import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './services/auth.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwtAuthStrategy';
import { MailModule } from '../mail/mail.module';
import { TokenService } from './services/token.service';
import { ResetPasswordService } from './services/resetpassword.service';
import { TwoFactorModule } from '../TwoFactorModule/twoFactor.module';

@Module({
  imports: [
    UsersModule,
    MailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService) => {
        const JWT_SECRET = configService.get('JWT_SECRET');
        const JWT_SECONDS_EXPIRE = configService.get('JWT_SECONDS_EXPIRE');
        const JWT_REFRESH_SECRET = configService.get('JWT_REFRESH_SECRET');
        const JWT_REFRESH_SECONDS_EXPIRE = configService.get('JWT_REFRESH_SECONDS_EXPIRE');
        const JWT_2FA_SECRET = configService.get('JWT_2FA_SECRET');

        if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
          throw new Error(
            'JWT_SECRET or JWT_REFRESH_SECRET is not defined in the environment variables',
          );
        }
        if (!JWT_SECONDS_EXPIRE || !JWT_REFRESH_SECONDS_EXPIRE) {
          throw new Error(
            'JWT_SECONDS_EXPIRE or JWT_REFRESH_SECONDS_EXPIRE is not defined in the environment variables',
          );
        }

        if (!JWT_2FA_SECRET) {
          throw new Error('JWT_2FA_SECRET is not defined in the environment variables');
        }

        return {
          secret: JWT_SECRET,
          signOptions: { expiresIn: Number(JWT_SECONDS_EXPIRE) },
        };
      },
    }),
    TwoFactorModule,
  ],
  exports: [AuthService],
  providers: [AuthService, AuthResolver, JwtStrategy, TokenService, ResetPasswordService],
})
export class AuthModule {}

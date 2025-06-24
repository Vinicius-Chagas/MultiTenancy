/*
https://docs.nestjs.com/guards#guards
*/

import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../decorators/isPublic.decorator';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      if (info instanceof TokenExpiredError || info?.name === 'TokenExpiredError') {
        console.error(`JwtAuthGuard: TokenExpiredError. Expired At: ${info.expiredAt}`);
        throw new UnauthorizedException(`Token expirado em ${info.expiredAt}`);
      }
      if (info instanceof JsonWebTokenError || info?.name === 'JsonWebTokenError') {
        console.error(`JwtAuthGuard: JsonWebTokenError - ${info.message}`);
        throw new UnauthorizedException(`Token inválido: ${info.message}`);
      }
      console.error('JwtAuthGuard: Unauthorized access. Error:', err, 'Info:', info);
      throw new UnauthorizedException('You are not authorized to access this resource');
    }

    console.log('JwtAuthGuard: User is authenticated.');
    return user;
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}

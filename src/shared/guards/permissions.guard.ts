/*
https://docs.nestjs.com/guards#guards
*/

import {
  Injectable,
  ExecutionContext,
  CanActivate,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { Request } from 'express';
import { TokenUserDto } from '../dto/tokenUserOutput.dto';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = this.getRequest(context);

    const user: Omit<TokenUserDto, 'password' | 'refresh_token'> = request.user;
    if (!user || !user.role.permissions) {
      throw new UnauthorizedException('Permissões não encontradas no usuário.');
    }
    const userPermissions = new Set(user.role.permissions.map((p) => p.slug));

    const hasAllRequiredPermissions = requiredPermissions.every((permission) =>
      userPermissions.has(permission),
    );

    console.log('User Permissions:', userPermissions);
    console.log('Required Permissions:', requiredPermissions);

    if (!hasAllRequiredPermissions) {
      throw new ForbiddenException('Permissões insuficientes.');
    }

    return true;
  }

  getRequest(context: ExecutionContext): Request {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    return req;
  }
}

import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(ctx: ExecutionContext) {
    const roles = this.reflector.get<string[]>('roles', ctx.getHandler());
    const canActivate = await super.canActivate(ctx);
    if (!roles && canActivate) {
      return true;
    }
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return (user.roles as any).some((role) => roles.includes(role.name));
  }
}
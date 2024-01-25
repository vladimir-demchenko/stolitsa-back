import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

type JWTPayload = {
  roles: [{ name: string }];
  services: [{ id: string; name: string }];
};

export const UserEduRoles = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: JWTPayload = request.user;
    if (user) {
      return user.roles
        .map((role) => role.name);
    } else {
      throw new UnauthorizedException();
    }
  },
);

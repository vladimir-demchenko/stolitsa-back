import { Role } from 'src/roles/entities/role.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const IsAdmin = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): boolean => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return (user.roles as [Role]).some((role) => role.name === 'admin');
  },
);

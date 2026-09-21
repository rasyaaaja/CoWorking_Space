import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminSpaceGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user && user.role === 'admin_space') {
      return true;
    }

    throw new ForbiddenException('Akses ditolak! Endpoint ini khusus Admin Space.');
  }
}
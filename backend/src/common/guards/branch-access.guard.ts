import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class BranchAccessGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) return true;

    const requestedBranchId = request.headers['x-branch-id'] as string | undefined;
    const defaultBranchId = user.defaultBranchId as string | undefined;
    const branchId = requestedBranchId || defaultBranchId;
    if (!branchId) {
      request.branchId = undefined;
      return true;
    }

    const branchIds: string[] = user.branchIds || [];
    const isAdmin = (user.roles || []).includes('ADMIN');
    if (!isAdmin && branchIds.length > 0 && !branchIds.includes(branchId)) {
      throw new ForbiddenException('You do not have access to this branch');
    }

    request.branchId = branchId;
    return true;
  }
}

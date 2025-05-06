import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger('RolesGuard');
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // If no roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const { user } = request;
    
    // For debugging purposes
    this.logger.debug(`Required roles: ${JSON.stringify(requiredRoles)}`);
    this.logger.debug(`User object: ${JSON.stringify(user)}`);
    
    // If no user is present (not authenticated)
    if (!user) {
      // For endpoints that allow anonymous access with optional auth
      const isOptionalAuth = request.route.path.includes('/api/v1/comments');
      if (isOptionalAuth) {
        this.logger.debug('Anonymous access allowed for this route');
        return true;
      }
      
      throw new ForbiddenException('Authentication required to access this resource');
    }
    
    // Check if user has any of the required roles
    if (user.role && requiredRoles.includes(user.role)) {
      return true;
    }
    
    // Special case for admin role - always grant access
    if (user.role === 'admin') {
      return true;
    }
    
    throw new ForbiddenException('You do not have permission to access this resource');
  }
}
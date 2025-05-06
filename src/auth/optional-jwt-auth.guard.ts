import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    private readonly logger = new Logger('OptionalJwtAuthGuard');

    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        // Add detailed logging to diagnose authentication issues
        if (err) {
            this.logger.warn(`JWT validation error: ${err.message}`);
        }

        if (info) {
            this.logger.debug(`JWT info: ${info instanceof Error ? info.message : JSON.stringify(info)}`);
        }

        const req = context.switchToHttp().getRequest();
        this.logger.debug(`Auth header present: ${!!req.headers.authorization}`);
        
        // If there's an error or no user is found, return null (anonymous user)
        if (err || !user) {
            return null;
        }

        // User was successfully authenticated
        this.logger.debug(`Authenticated user: ${JSON.stringify(user)}`);
        
        // Return the authenticated user if JWT is valid
        return user;
    }
}

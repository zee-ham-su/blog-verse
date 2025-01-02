import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        // If there's an error or no user is found, return null (anonymous user)
        if (err || !user) {
            return null;
        }
        // Return the authenticated user if JWT is valid
        return user;
    }
}

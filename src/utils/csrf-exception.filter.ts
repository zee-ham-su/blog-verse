import { ExceptionFilter, Catch, ArgumentsHost, ForbiddenException, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(ForbiddenException)
export class CsrfExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    
    // Check if this is a CSRF error
    const errorMessage = exception.message || '';
    if (errorMessage.includes('CSRF') || errorMessage.includes('csrf')) {
      return response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: 'Invalid or missing CSRF token. Please get a new token from /api/v1/auth/csrf-token and include it in the X-CSRF-Token header.',
        error: 'Forbidden'
      });
    }
    
    // For other forbidden errors, return the original exception response
    return response.status(status).json(exception.getResponse());
  }
}
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as csurf from 'csurf';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  private csrfProtection: any;
  private readonly logger = new Logger('CsrfMiddleware');

  constructor() {
    this.csrfProtection = csurf({
      cookie: {
        httpOnly: true,
        sameSite: 'lax',  // Changed from 'strict' to 'lax' for better compatibility
        secure: process.env.NODE_ENV === 'production',
      },
      ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],  // Always ignore these methods
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    // Skip CSRF protection for specific routes
    if (this.shouldSkipCsrf(req)) {
      this.logger.debug(`Skipping CSRF check for path: ${req.path}`);
      return next();
    }
    
    // For debugging
    this.logger.debug(`Applying CSRF protection for path: ${req.path}, method: ${req.method}`);
    
    // Apply CSRF protection with error handling
    this.csrfProtection(req, res, (err: any) => {
      if (err) {
        this.logger.error(`CSRF Error: ${err.message} for path: ${req.path}`);
        // Still pass the error to the global exception filter
      }
      next(err);
    });
  }
  
  // Helper method to determine if CSRF should be skipped
  private shouldSkipCsrf(req: Request): boolean {
    // Skip root path requests completely (often used for health checks or proxies)
    if (req.path === '/' || req.path === '') {
      return true;
    }
    
    // Skip for authentication routes
    if (
      req.path.includes('/api/v1/auth/login') || 
      req.path.includes('/api/v1/auth/register')
    ) {
      return true;
    }
    
    // Skip for comments routes - for public commenting functionality
    if (req.path.includes('/api/v1/comments')) {
      return true;
    }
    
    // Skip for Swagger/API docs
    if (req.path.includes('/api/docs')) {
      return true;
    }
    
    // Skip OPTIONS requests (pre-flight CORS)
    if (req.method === 'OPTIONS') {
      return true;
    }
    
    // Skip GET requests
    if (req.method === 'GET') {
      return true;
    }
    
    // Allow testing without CSRF in development mode
    if (process.env.DISABLE_CSRF === 'true') {
      return true;
    }
    
    // Skip CSRF for uploads
    if (req.path.includes('/uploads/')) {
      return true;
    }
    
    return false;
  }
}
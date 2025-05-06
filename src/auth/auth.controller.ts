import { Controller, Post, Body, UseGuards, Request, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthEntity } from './entities/auth.entity';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiTags('auth')
  @ApiOperation({ summary: 'Authenticate a user' })
  @ApiResponse({ status: 200, description: 'User authenticated successfully', type: AuthEntity })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: 'password123' },
      },
      required: ['email', 'password'],
    },
  })
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('csrf-token')
  @ApiOperation({ summary: 'Get a CSRF token' })
  @ApiResponse({ status: 200, description: 'CSRF token retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getCsrfToken(@Request() req, @Res({ passthrough: true }) res: Response) {
    // The CSRF token is already set in the cookie by the middleware
    // This endpoint just returns the token to be used in headers
    const csrfToken = req.csrfToken();
    return { csrfToken };
  }
}

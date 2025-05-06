import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogModule } from './blog/blog.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { CsrfMiddleware } from './utils/csrf.middleware';
import * as cookieParser from 'cookie-parser';

@Module({
  imports: [
    CacheModule.register({
      ttl: 60, // Cache time-to-live in seconds
      max: 100, // Maximum number of items in cache
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        serverApi: {
          version: '1',
          strict: true,
          deprecationErrors: true,
        },
      }),
      inject: [ConfigService],
    }),
    BlogModule,
    UserModule,
    AuthModule,
    CommentsModule,
    ThrottlerModule.forRoot({
      ttl: 60, // Time-to-live in seconds
      limit: 10, // Maximum number of requests per TTL
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply cookie-parser middleware globally
    consumer.apply(cookieParser()).forRoutes('*');
    
    // Apply CSRF protection middleware globally - the middleware itself will decide
    // which routes to protect based on its internal logic
    consumer
      .apply(CsrfMiddleware)
      .forRoutes('*');
  }
}
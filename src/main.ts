import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters();
  app.useGlobalInterceptors();
  
  // Serve static files from uploads directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Blog API')
    .setDescription('The NestJS Blog API provides a powerful and flexible solution for managing blog content. It allows users to create, edit, delete, and view blog posts with rich metadata. The API supports features like authentication, user roles, and categorization, making it ideal for building modern blogging platforms. Designed with RESTful principles in mind, the API ensures scalability, security, and ease of integration with frontend applications. This API also includes features for comment management, post searching, and content filtering.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document,
    {
      swaggerOptions: {
        tagSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    },
  );

  // Validation pipe
  app.useGlobalPipes(new ValidationPipe());

  const mongoUri = configService.get<string>('MONGODB_URI');
  await mongoose.connect(mongoUri);

  console.log("Pinged your deployment. You successfully connected to MongoDB!");

  // Get port from environment variable or use 3001 as default
  const port = configService.get<number>('PORT') || 3001;
  await app.listen(port);
  console.log(`Server is running on port 🚀 http://localhost:${port}/api/docs`);
}
bootstrap();

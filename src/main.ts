import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Blog API')
    .setDescription('The NestJS Blog API provides a powerful and flexible solution for managing blog content. It allows users to create, edit, delete, and view blog posts with rich metadata. The API supports features like authentication, user roles, and categorization, making it ideal for building modern blogging platforms. Designed with RESTful principles in mind, the API ensures scalability, security, and ease of integration with frontend applications. This API also includes features for comment management, post searching, and content filtering.')
    .setVersion('1.0')
    .addTag('blogs')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Validation pipe
  app.useGlobalPipes(new ValidationPipe());

  const mongoUri = configService.get<string>('MONGODB_URI');
  await mongoose.connect(mongoUri);

  console.log("Pinged your deployment. You successfully connected to MongoDB!");

  await app.listen(3000);
  console.log('Server is running on port 🚀', 'http://localhost:3000');
}
bootstrap();

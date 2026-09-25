import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module.js';

import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ============================================================
  // CORS
  // ============================================================

  app.enableCors({
    origin: true,
    credentials: true,
  });

  // ============================================================
  // GLOBAL API PREFIX
  // ============================================================

  app.setGlobalPrefix('api');

  // ============================================================
  // VALIDATION
  // ============================================================

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ============================================================
  // SWAGGER
  // ============================================================

  const swaggerConfig = new DocumentBuilder()
    .setTitle('BloodLink API')
    .setDescription(
      'BloodLink - Blood Donor Finder API Documentation',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const swaggerDocument =
    SwaggerModule.createDocument(
      app,
      swaggerConfig,
    );

  SwaggerModule.setup(
    'api/docs',
    app,
    swaggerDocument,
  );

  // ============================================================
  // START SERVER
  // ============================================================

  const port = process.env.PORT || 5000;

  await app.listen(port);

  console.log(
    `BloodLink API running on http://localhost:${port}/api`,
  );

  console.log(
    `Swagger running on http://localhost:${port}/api/docs`,
  );
}

bootstrap();
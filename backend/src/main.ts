import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CommandFactory } from 'nest-commander';
import { CliModule } from './cli/cli.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import pkg from '../package.json';

import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS liberado
  app.enableCors();

  // Pipes de validação global (Zod + class-validator coerentes)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Interceptor para padronizar resposta
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Filter para erros padronizados
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger com JWT Authorize global (nome bate com @ApiBearerAuth)
  const config = new DocumentBuilder()
    .setTitle('Conectar API')
    .setDescription('API para gerenciamento de usuários')
    .setVersion(pkg.version)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Informe seu token JWT',
        in: 'header',
      },
      'access-token', // Nome padronizado: @ApiBearerAuth('access-token')
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Porta + endereço do .env ou fallback
  const port = process.env.BACKEND_PORT || 3000;
  const address = process.env.IP_ADDRESS || 'localhost';

  await app.listen(port);
  console.log(`🚀 Server running on http://${address}:${port}`);
  console.log(`📑 Swagger: http://${address}:${port}/api`);
}

bootstrap();

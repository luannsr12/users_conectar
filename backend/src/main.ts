import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CommandFactory } from 'nest-commander';
import { CliModule } from './cli/cli.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import pkg from '../package.json';

import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Pega o configService depois do app ser criado
  const configService = app.get(ConfigService);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

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
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Usa as variáveis do .env via ConfigService
  const port = configService.get<number>('BACKEND_PORT') || 3000;
  const address = configService.get<string>('IP_ADDRESS') || 'localhost';

  await app.listen(port);
  console.log(`🚀 Server running on http://${address}:${port}`);
  console.log(`📑 Swagger: http://${address}:${port}/api`);
}

bootstrap();

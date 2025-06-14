// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import pkg from '../package.json';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para permitir chamadas do frontend
  app.enableCors();

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Conectar API')
    .setDescription('API para gerenciamento de usuários')
    .setVersion(pkg.version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Iniciar na porta do .env ou 3000
  const port = process.env.BACKEND_PORT || 3000;
  const address = process.env.BACKEND_ADDRESS || 'localhost';
  await app.listen(port);
  console.log(`🚀 Server running on ${address}:${port}`);
  console.log(`📑 Swagger: ${address}:${port}/api`);
}
bootstrap();

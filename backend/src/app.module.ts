// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LangModule } from './lang/lang.module';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SeederModule } from './seeder/seeder.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LangModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: config.get<'mysql' | 'postgres'>('DB_TYPE') || 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT') ?? 3000,
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        // synchronize = true só em modo dev
        synchronize: config.get<string>('MODE') !== 'prod',
      }),
    }),
    UsersModule,
    AuthModule,
    SeederModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SecurityModule } from './common/guards/security.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

import { AppController } from './app.controller'; // Health & version
import { AdminUsersController } from './modules/admin/admin-users.controller'; // Admin CRUD

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: config.get<'mysql' | 'postgres'>('DB_TYPE') || 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT') ?? 3306, // mysql default
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
        migrationsRun: false,
      }),
    }),

    SecurityModule, // JWT global
    UsersModule,    // Perfil user
    AuthModule,     // Login/Register
  ],

  controllers: [
    AppController,          // Health check & version
    AdminUsersController,   // Admin rotas (fora de module dedicado)
  ],
})
export class AppModule { }

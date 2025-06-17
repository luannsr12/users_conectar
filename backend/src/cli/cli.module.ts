// src/cli/cli.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from '../modules/seeder/seeder.service';
import { PopulateUsersCommand } from './populate-users.command';
import { GenerateAdminCommand } from './generate-admin.command';
import { UsersModule } from '../modules/users/users.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: config.get<'mysql' | 'postgres'>('DB_TYPE') || 'mysql',
                host: config.get<string>('DB_HOST'),
                port: config.get<number>('DB_PORT') ?? 3306,
                username: config.get<string>('DB_USER'),
                password: config.get<string>('DB_PASS'),
                database: config.get<string>('DB_NAME'),
                autoLoadEntities: true,
                synchronize: false,
            }),
        }),
        UsersModule,
    ],
    providers: [SeederService, PopulateUsersCommand, GenerateAdminCommand],
})
export class CliModule { }

// src/seeder/seeder.module.ts
import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [UsersModule],
    providers: [SeederService],
})
export class SeederModule { }

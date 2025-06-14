// src/seeder/seeder.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService implements OnModuleInit {
    constructor(
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
    ) { }

    private readonly logger = new Logger(SeederService.name);

    async onModuleInit() {
        const mode = this.configService.get<string>('MODE') || 'dev';

        if (mode === 'prod') {
            this.logger.log('Seeder skipped: running in production mode.');
            return;
        }

        const email = 'admin@admin.com';
        const password = 'admin';

        const existing = await this.usersService.findByEmail(email);
        if (existing) {
            this.logger.log(`Admin already exists: ${email}`);
            return;
        }

        const hash = await bcrypt.hash(password, 10);
        await this.usersService.create({
            name: 'Admin',
            email,
            password: hash,
            role: 'admin',
        });

        this.logger.log(`Admin created: ${email} / ${password}`);
    }
}

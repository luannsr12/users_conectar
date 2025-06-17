// src/seeder/seeder.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { subDays, subMinutes } from 'date-fns';
import axios from 'axios';

@Injectable()
export class SeederService implements OnModuleInit {
    private readonly logger = new Logger(SeederService.name);

    constructor(
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
    ) { }

    async onModuleInit() {
        const mode = this.configService.get<string>('MODE') || 'dev';

        if (mode === 'prod') {
            this.logger.log('Seeder skipped: running in production mode.');
            return;
        }

        // Cria admin com senha default
        await this.createAdmin('admin123');

        // Cria 20 usuários random
        // await this.createRandomUsers(20);
    }

    /**
     * Garante criação de um admin único
     * @param password senha customizada
     */
    async createAdmin(password = 'admin123') {
        const email = 'admin@admin.com';
        const existing = await this.usersService.findByEmail(email);

        if (existing) {
            this.logger.log(`Admin já existe: ${email}`);
            return;
        }

        await this.usersService.create({
            name: 'Admin',
            email,
            password,
            role: 'admin',
        });

        this.logger.log(`Admin criado: ${email} / ${password}`);
    }

    /**
     * Cria múltiplos usuários aleatórios usando randomuser.me
     * @param count quantidade de usuários
     */
    async createRandomUsers(count = 20) {
        try {
            const { data } = await axios.get(`https://randomuser.me/api/?results=${count}&nat=br`);
            const randomUsers = data.results;

            let createdCount = 0;
            const last5Overrides = [
                { minDays: 36, tag: "login+35d" },
                { minMinutes: 0, maxMinutes: 5, tag: "login-5min" },
                { minMinutes: 61, maxMinutes: 90, tag: "login-1hr" },
                {}, {}, // mais 2 aleatórios dentro do intervalo
            ];

            for (const randomUser of randomUsers) {
                const email = randomUser.email;
                const name = `${randomUser.name.first} ${randomUser.name.last}`;
                const password = 'user123';

                const exists = await this.usersService.findByEmail(email);
                if (exists) {
                    this.logger.log(`Random user já existe: ${email}`);
                    continue;
                }

                // Dados básicos do user
                const userData: any = {
                    name,
                    email,
                    password,
                    role: 'user',
                };

                // Se estiver entre os últimos 5 criados
                if (createdCount >= count - 5) {
                    const i = createdCount - (count - 5);
                    const override = last5Overrides[i] || {};

                    // created_at entre 31 e 90 dias atrás
                    const createdDaysAgo = Math.floor(Math.random() * 60) + 31;
                    userData.created_at = subDays(new Date(), createdDaysAgo);

                    // last_login definido por regra
                    if (override.minDays) {
                        userData.last_login = subDays(new Date(), override.minDays);
                    } else if (override.minMinutes && override.maxMinutes) {
                        const min = override.minMinutes;
                        const max = override.maxMinutes;
                        const minutesAgo = Math.floor(Math.random() * (max - min)) + min;
                        userData.last_login = subMinutes(new Date(), minutesAgo);
                    } else {
                        // fallback: aleatório entre 5min e 35 dias
                        const totalMinutes = Math.floor(Math.random() * (35 * 24 * 60 - 5)) + 5;
                        userData.last_login = subMinutes(new Date(), totalMinutes);
                    }
                }

                await this.usersService.create(userData);
                this.logger.log(`Random user criado: ${email} / ${password}`);
                createdCount++;
            }
        } catch (error) {
            this.logger.error('Erro ao gerar usuários aleatórios', error);
        }
    }
}

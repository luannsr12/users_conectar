import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {
        super({
            clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
            clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
            callbackURL: configService.get<string>('BACKEND_URL') + '/auth/google/callback',
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any) {
        // 1. Verifica se o usuário já existe no seu banco de dados
        let user = await this.usersService.findByEmail(profile.emails?.[0]?.value);

        // 2. Se não existir, cria um novo usuário (opcional)
        if (!user) {

            user = await this.usersService.create({
                email: profile.emails?.[0]?.value,
                name: profile.displayName,
                password: Date.now().toString(),
                social_login: JSON.stringify({ plataform: 'google', active: true, id: profile.id }),
            });
        }

        // 3. Gera um JWT no mesmo formato que sua JwtStrategy espera
        const payload = {
            sub: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            updatedAt: user.updatedAt,
            createdAt: user.createdAt
        };      

        return {
            ...payload,
            accessToken: this.jwtService.sign(payload),
        };
    }
}
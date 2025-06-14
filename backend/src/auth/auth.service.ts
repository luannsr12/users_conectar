// backend/src/auth/auth.service.ts
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LangService } from '../lang/lang.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private lang: LangService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && user.password && await bcrypt.compare(pass, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(data: { email: string; password: string }) {
        const user = await this.usersService.findByEmail(data.email);
        if (!user || !user.password) {
            throw new UnauthorizedException(this.lang.get('auth.invalid_credentials'));
        }

        const isValid = await bcrypt.compare(data.password, user.password);
        if (!isValid) {
            throw new UnauthorizedException(this.lang.get('auth.invalid_credentials'));
        }

        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(data: any) {
        const existingUser = await this.usersService.findByEmail(data.email);
        if (existingUser) {
            throw new BadRequestException(this.lang.get('auth.email_in_use'));
        }
        return this.usersService.create(data);
    }

    async socialLogin(data: any) {
        try {
            let user = await this.usersService.findByEmail(data.email);

            if (!user) {
                user = await this.usersService.create({
                    name: data.name,
                    email: data.email,
                    password: '', // social não usa senha
                    social_login: { social: data.social, active: 1 },
                });
            } else {
                user.social_login = { social: data.social, active: 1 };
                await this.usersService.update(user.id, { social_login: user.social_login });
            }

            const payload = { email: user.email, sub: user.id, role: user.role };
            return { access_token: this.jwtService.sign(payload) };

        } catch (error) {
            console.error('Social login failed:', error);
            throw new BadRequestException(this.lang.get('auth.social_login_exception'));
        }
    }
}

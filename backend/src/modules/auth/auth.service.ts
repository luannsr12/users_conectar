import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }

    async login(data: { email: string; password: string }) {
        const user = await this.validateUser(data.email, data.password);
        if (!user) {
            throw new UnauthorizedException('Dados inválidos');
        }

        const payload = { sub: user.id, email: user.email, role: user.role };
        return { access_token: this.jwtService.sign(payload) };
    }

    async register(data: { name: string; email: string; password: string }) {
        const existing = await this.usersService.findByEmail(data.email);
        if (existing) {
            throw new BadRequestException('Esse email já esta em uso');
        }
        return this.usersService.create(data);
    }
}

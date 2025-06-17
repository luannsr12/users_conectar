import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

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

    const payload = { sub: user.id, name: user.name, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(data: { name: string; email: string; password?: string }) {
    // 1. Garante que a senha foi enviada
    if (!data.password) {
      throw new BadRequestException('Senha é obrigatória');
    }

    // 2. Garante que não existe usuário com o mesmo e-mail
    const existing = await this.usersService.findByEmail(data.email);
    if (existing) {
      throw new BadRequestException('Esse email já está em uso');
    }

    // 3. Cria usuário, capturando possíveis erros do bcrypt/hash
    try {
      const isRegister = await this.usersService.create({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (isRegister){
        return { message: 'Cadastro realizado com sucesso!' };
      }

    } catch (err: any) {
      // Se der erro no bcrypt.hash, cai aqui
      throw new BadRequestException(err.message || 'Erro ao criar usuário');
    }
  }
}

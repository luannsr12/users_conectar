// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    // Cria um novo usuário com senha criptografada
    async create(data: Partial<User>) {
        const hash = await bcrypt.hash(data.password, 10);
        const user = this.usersRepository.create({
            ...data,
            password: hash,
        });
        return this.usersRepository.save(user);
    }

    // Busca todos os usuários (com filtros e ordenação)
    async findAll(
        role?: string,
        sortBy: 'name' | 'createdAt' = 'name',
        order: 'asc' | 'desc' = 'asc',
    ) {
        const where: FindOptionsWhere<User> = {};
        if (role) {
            where.role = role as any;
        }

        return this.usersRepository.find({
            where,
            order: { [sortBy]: order.toUpperCase() as 'ASC' | 'DESC' },
        });
    }

    // Busca um usuário por ID
    async findOne(id: string) {
        const user = await this.usersRepository.findOne({
            where: { id },
            select: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt'],
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    // Busca por email (usado no AuthService)
    async findByEmail(email: string) {
        return this.usersRepository.findOne({ where: { email } });
    }

    // Atualiza dados do próprio usuário (com hash de nova senha, se enviada)
    async update(id: string, updateData: Partial<User>) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        Object.assign(user, updateData);
        return this.usersRepository.save(user);
    }

    // Deleta um usuário (usado por admin)
    async remove(id: string) {
        const result = await this.usersRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('User not found');
        }
        return { message: 'User deleted successfully' };
    }

    // Lista usuários inativos (sem login nos últimos 30 dias) — opcional!
    async findInactiveUsers() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        return this.usersRepository
            .createQueryBuilder('user')
            .where('user.updatedAt < :date', { date: thirtyDaysAgo.toISOString() })
            .getMany();
    }
}

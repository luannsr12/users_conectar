import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../common/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) { }

    async create(data: Partial<User>) {
        const hash = await bcrypt.hash(data.password, 10);
        const user = this.usersRepository.create({
            ...data,
            password: hash,
        });
        return this.usersRepository.save(user);
    }

    async findAll() {
        return this.usersRepository.find();
    }

    async findOne(id: string) {
        const user = await this.usersRepository.findOne({
            where: { id },
            select: ['id', 'name', 'email', 'password', 'role', 'last_login', 'createdAt', 'updatedAt'],
        });
        if (!user) {
            throw new NotFoundException('Usuário não localizado');
        }
        return user;
    }

    async findById(id: string) {
        return this.usersRepository.findOne({
            where: { id },
            select: ['id', 'email', 'role'],
        });
    }

    async findByEmail(email: string) {
        return this.usersRepository.findOne({
            where: { email },
            select: ['id', 'name', 'email', 'password', 'role', 'last_login', 'createdAt', 'updatedAt'],
        });
    }
    

    async update(id: string, data: Partial<User>) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('Usuário não localizado');
        }

        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        Object.assign(user, data);
        return this.usersRepository.save(user);
    }

    async remove(id: string) {
        const result = await this.usersRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException('Usuário não localizado');
        }
        return { message: 'Usuário deletado com sucesso!' };
    }
}

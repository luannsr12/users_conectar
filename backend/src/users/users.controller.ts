// src/users/users.controller.ts
import {
    Controller,
    Get,
    UseGuards,
    Request,
    Param,
    Query,
    Patch,
    Body,
    Delete,
    ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    // Somente admins podem listar todos os usuários
    @Get()
    async findAll(
        @Request() req,
        @Query('role') role?: string,
        @Query('sortBy') sortBy: 'name' | 'createdAt' = 'name',
        @Query('order') order: 'asc' | 'desc' = 'asc',
    ) {
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('Access denied');
        }
        return this.usersService.findAll(role, sortBy, order);
    }

    // Ver dados do próprio usuário
    @Get('me')
    async getMe(@Request() req) {
        return this.usersService.findOne(req.user.id);
    }

    // Atualizar dados do próprio usuário
    @Patch('me')
    async updateMe(@Request() req, @Body() updateData) {
        return this.usersService.update(req.user.id, updateData);
    }

    // Somente admin pode deletar qualquer usuário
    @Delete(':id')
    async remove(@Request() req, @Param('id') id: string) {
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('Access denied');
        }
        return this.usersService.remove(id);
    }
}

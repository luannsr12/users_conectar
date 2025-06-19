import {
    Controller,
    Get,
    Post,
    Delete,
    Body,
    Param,
    Request,
    Query,
    ForbiddenException,
    UseGuards,
    Patch,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody, ApiQuery, ApiOperation } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../../common/pipe/zod-validation.pipe';
import { CreateUserDto, CreateUserSwaggerDto } from './dto/admin.dto';
import { UpdateUserSwaggerDto } from '../users/dto/user.dto';
import { UpdateUserSchema } from '../../common/schema/user.schema';

@ApiTags('Admin Users')
@ApiBearerAuth('access-token')
@Controller('admin/users')
@UseGuards(JwtAuthGuard)
export class AdminUsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('create')
    @ApiOperation({ summary: 'Cadastra um novo user' })
    @ApiBody({ type: CreateUserSwaggerDto })
    async create(@Request() req, @Body() data: CreateUserDto) {
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('Access denied');
        }
        return this.usersService.create(data);
    }


    @Patch('update/:id')
    @ApiOperation({ summary: 'Atualiza informações de um usuário' })
    @ApiBody({ type: UpdateUserSwaggerDto })
    updateMe(@Request() req, @Param('id') id: string, @Body(new ZodValidationPipe(UpdateUserSchema)) data: any) {
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('Access denied');
        }
        return this.usersService.update(id, data);
    }

    @Get()
    @ApiOperation({ summary: 'Listagem de users' })
    @ApiQuery({ name: 'role', required: false })
    async findAll(
        @Request() req,
        @Query('role') role?: string,
    ) {
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('Access denied');
        }
        return this.usersService.findAll();
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Deletar um user pelo id' })
    async remove(@Request() req, @Param('id') id: string) {
        if (req.user.role !== 'admin') {
            throw new ForbiddenException('Access denied');
        }
        return this.usersService.remove(id);
    }
}

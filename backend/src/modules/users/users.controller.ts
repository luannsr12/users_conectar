import {
    Controller,
    Get,
    Patch,
    Body,
    Request,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { UpdateUserDto, UpdateUserSwaggerDto } from './dto/user.dto';
import { ZodValidationPipe } from '../../common/pipe/zod-validation.pipe'
import { UpdateUserSchema } from '../../common/schema/user.schema';

@ApiTags('Users')
@ApiBearerAuth('access-token')
@Controller('users')
@UseGuards(JwtAuthGuard)

export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('me')
    @ApiOperation({ summary: 'Recupera dados do user logado' })
    getMe(@Request() req) {
        return this.usersService.findOne(req.user.id);
    }

    @Patch('me')
    @ApiOperation({ summary: 'Atualiza informações do próprio perfil' })
    @ApiBody({ type: UpdateUserSwaggerDto })
    updateMe(@Request() req, @Body(new ZodValidationPipe(UpdateUserSchema)) data: any) {
        return this.usersService.update(req.user.id, data);
    }
}

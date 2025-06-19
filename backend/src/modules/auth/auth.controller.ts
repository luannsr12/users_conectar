import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterAuthDto, LoginAuthDto } from './dto/auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    @ApiBody({ type: RegisterAuthDto })
    register(@Body() data: RegisterAuthDto) {
        return this.authService.register(data);
    }

    @Post('login')
    @ApiBody({ type: LoginAuthDto })
    login(@Body() data: LoginAuthDto) {
        return this.authService.login(data);
    }
}

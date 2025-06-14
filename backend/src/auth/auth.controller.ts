// backend/src/auth/auth.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @ApiBody({ type: RegisterAuthDto })
    async register(@Body() data: RegisterAuthDto) {
        return this.authService.register(data);
    }

    @Post('login')
    @ApiBody({ type: LoginAuthDto })
    async login(@Body() data: LoginAuthDto) {
        const user = await this.authService.validateUser(data.email, data.password);
        return this.authService.login(user);
    }
}
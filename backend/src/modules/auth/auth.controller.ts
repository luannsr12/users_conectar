import { Controller, Post, Body, Get, UseGuards, Req, Res } from '@nestjs/common';
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { RegisterAuthDto, LoginAuthDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { FastifyReply } from 'fastify'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly config: ConfigService
      ) {}
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

    // ===== GOOGLE OAUTH ROUTES =====
    @Get('google')
    @UseGuards(AuthGuard('google'))
    googleLogin() {
        // O decorator @UseGuards já redireciona para o Google
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleLoginCallback(@Req() req, @Res() res: FastifyReply) {
        const frontendUrl = this.config.get<string>('FRONTEND_URL') ?? '*';

        try {
            const { accessToken } = req.user;

            const html = `
          <html>
            <body>
              <script>
                window.opener.postMessage({
                  success: true,
                  token: '${accessToken}',
                  user: ${JSON.stringify(req.user)}
                }, '${frontendUrl}');
                setTimeout(() => window.close(), 100);
              </script>
            </body>
          </html>
        `;

            return res.type('text/html').send(html);

        } catch (err: any) {
            const html = `
          <html>
            <body>
              <script>
                window.opener.postMessage({
                  success: false,
                  error: ${JSON.stringify(err?.message || 'Erro ao autenticar com o Google')}
                }, '${frontendUrl}');
                setTimeout(() => window.close(), 100);
              </script>
            </body>
          </html>
        `;

            return res.type('text/html').send(html);
        }
    }
    
}

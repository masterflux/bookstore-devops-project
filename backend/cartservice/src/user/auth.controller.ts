import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body: { username: string; password: string }): Promise<{ success: boolean }> {
        const { username, password } = body;
        const success = await this.authService.login(username, password);
        return { success };
    }
}

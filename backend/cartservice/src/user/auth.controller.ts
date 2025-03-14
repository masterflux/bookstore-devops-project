import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body: { username: string; password: string }): Promise<{ success: boolean, userId?: number; }> {
        const { username, password } = body;
        const res = await this.authService.login(username, password);
        return {
            success: res.isPasswordValid,
            userId: res.userId
         };
    }
}

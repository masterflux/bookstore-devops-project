import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) { }

    async login(username: string, password: string): Promise<{ isPasswordValid: boolean; userId?: number; }> {
        const res = await this.userService.validateUser(username, password);
        return res;
    }
}

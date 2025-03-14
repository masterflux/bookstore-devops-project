import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) { }

    async login(username: string, password: string): Promise<boolean> {
        const isValid = await this.userService.validateUser(username, password);
        return isValid;
    }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {    
        
    }


    async findByUsername(username: string): Promise<User | undefined> {
        try {
            return await this.userRepository.findOneBy({ username });
        } catch (error) {
            console.error('Error in findByUsername:', error);
            throw new Error('Unable to find user');
        }
    }

    async validateUser(username: string, password: string): Promise<boolean> {
        try {
            const user = await this.findByUsername(username);
            if (!user) {
                console.log('User not found');
                return false; 
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            return isPasswordValid; 
        } catch (error) {
            console.error('Error in validateUser:', error);
            throw new Error('Unable to validate user');
        }
    }
}

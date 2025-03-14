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
        // bcrypt.hash('2', 10, (err, hash) => {
        //     if (err) throw err;
        //     console.log('Hashed password:', hash);
        // });
    }


    async findByUsername(username: string): Promise<User | undefined> {
        try {
            return await this.userRepository.findOneBy({ username });
        } catch (error) {
            console.error('Error in findByUsername:', error);
            throw new Error('Unable to find user');
        }
    }

    async validateUser(username: string, password: string): Promise<{ isPasswordValid: boolean; userId?: number; }> {
        try {
            const user = await this.findByUsername(username);
            console.log('%cuser: ','color: MidnightBlue; background: Aquamarine; font-size: 20px;',user);
            if (!user) {
                console.log('User not found');
                return {
                    isPasswordValid: false
                }; 
            }


            const isPasswordValid = await bcrypt.compare(password, user.password);
            return {
                isPasswordValid,
                userId: user.id
            }; 
        } catch (error) {
            console.error('Error in validateUser:', error);
            throw new Error('Unable to validate user');
        }
    }
}
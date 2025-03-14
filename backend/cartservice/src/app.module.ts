import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart/cart.entity';
import { Book } from './cart/book.entity';
import { User } from './user/user.entity';
import { CartService } from './cart/cart.service';
import { CartController } from './cart/cart.controller';
import { UserService } from './user/user.service';
import { AuthService } from './user/auth.service';
import { AuthController } from './user/auth.controller';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'bookstore-pg-server.postgres.database.azure.com',
            port: 5432,
            username: 'bookstore_admin',
            password: 'NewSecurePassword123!',
            database: 'postgres',
            entities: [Cart, Book, User],
            synchronize: false,
            ssl: {
                rejectUnauthorized: false,
            },
        }),
        TypeOrmModule.forFeature([Cart, Book, User]),
    ],
    controllers: [AuthController, CartController],
    providers: [UserService, AuthService, CartService],
})
export class AppModule { }

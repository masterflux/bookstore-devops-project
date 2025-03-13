import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart/cart.entity';
import { Book } from './book.entity';
import { CartService } from './cart/cart.service';
import { CartController } from './cart/cart.controller';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'bookstore-pg-server.postgres.database.azure.com',
            port: 5432,
            username: 'bookstore_admin',
            password: 'NewSecurePassword123!',
            database: 'postgres',
            entities: [Cart, Book],
            synchronize: false,
            ssl: {
                rejectUnauthorized: false, // 临时禁用证书验证（生产环境要用更安全的方式）
            },
        }),
        TypeOrmModule.forFeature([Cart, Book]),
    ],
    controllers: [CartController],
    providers: [CartService],
})
export class AppModule { }

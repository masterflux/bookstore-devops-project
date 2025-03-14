import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { Book } from './book.entity';


@Injectable()
export class CartService {

  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(Book) private bookRepo: Repository<Book>,
  ) {

  }

  async getCart(userId: string) {
    const cartItems = await this.cartRepo.find({ where: { userId } });

    const detailedCart = await Promise.all(
      cartItems.map(async (item) => {
        const book = await this.bookRepo.findOne({ where: { id: item.bookId } });
        if (!book) throw new NotFoundException(`Book with ID ${item.bookId} not found`);

        return {
          id: item.id,
          title: book.title,
          author: book.author,
          price: book.price,
          quantity: item.quantity,
          totalPrice: item.quantity * book.price,
        };
      }),
    );

    return detailedCart;
  }

  async addToCart(userId: string, bookId: number, quantity: number) {
    const book = await this.bookRepo.findOne({ where: { id: bookId } });

    if (!book || book.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    book.stock -= quantity;
    await this.bookRepo.save(book);

    const existingCartItem = await this.cartRepo.findOne({ where: { userId, bookId } });
    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      return await this.cartRepo.save(existingCartItem);
    } else {
      const cartItem = this.cartRepo.create({ userId, bookId, quantity });
      return await this.cartRepo.save(cartItem);
    }
  }



  async updateCart(userId: string, bookId: number, quantity: number) {
    const cartItem = await this.cartRepo.findOne({ where: { userId, bookId } });
    if (!cartItem) throw new NotFoundException('Item not found in cart');

    const book = await this.bookRepo.findOne({ where: { id: bookId } });

    if (!book || book.stock + cartItem.quantity < quantity) {
      throw new BadRequestException(`Insufficient stock, current stock: ${book?.stock}`);
    }

    const stockAdjustment = quantity - cartItem.quantity;
    book.stock -= stockAdjustment;
    await this.bookRepo.save(book);

    cartItem.quantity = quantity;
    await this.cartRepo.save(cartItem);

    return { message: 'Cart updated' };
  }

  async removeCartItem(userId: string, bookId: number) {
    const cartItem = await this.cartRepo.findOne({ where: { userId, bookId } });
    if (!cartItem) throw new NotFoundException('Item not found in cart');

    const book = await this.bookRepo.findOne({ where: { id: bookId } });

    if (book) {
      book.stock += cartItem.quantity;
      await this.bookRepo.save(book);
    }

    await this.cartRepo.delete(cartItem.id);
    return { message: 'Item removed from cart and stock restored' };
  }


  async clearCart(userId: string) {
    const cartItems = await this.cartRepo.find({ where: { userId } });

    for (const item of cartItems) {
      const book = await this.bookRepo.findOne({ where: { id: item.bookId } });
      if (book) {
        book.stock += item.quantity;
        await this.bookRepo.save(book);
      }
    }

    await this.cartRepo.delete({ userId });
    return { message: 'Cart cleared and stock restored' };
  }
}

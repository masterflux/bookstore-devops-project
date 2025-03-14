import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Get(':userId')
  getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Post()
  addToCart(@Body() body) {
    return this.cartService.addToCart(body.userId, body.bookId, body.quantity);
  }

  @Put(':bookId')
  updateCart(@Param('bookId') bookId: number, @Body() body) {
    return this.cartService.updateCart(body.userId, bookId, body.quantity);
  }

  @Delete(':bookId')
  removeItem(@Param('bookId') bookId: number, @Body('userId') userId: string) {
    return this.cartService.removeCartItem(userId, bookId);
  }

  @Delete('/clear/:userId')
  clearCart(@Param('userId') userId: string) {
    return this.cartService.clearCart(userId);
  }
}

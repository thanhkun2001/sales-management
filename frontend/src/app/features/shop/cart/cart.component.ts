import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CartService, CartItem } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  constructor(
    public cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  onIncrease(item: CartItem) {
    this.cartService.updateQuantity(item.productId, item.quantity + 1);
  }

  onDecrease(item: CartItem) {
    this.cartService.updateQuantity(item.productId, item.quantity - 1);
  }

  onRemove(item: CartItem) {
    this.cartService.removeItem(item.productId);
    this.snackBar.open('Đã xóa sản phẩm khỏi giỏ hàng', 'Đóng', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }

  onClearCart() {
    this.cartService.clearCart();
    this.snackBar.open('Đã xóa toàn bộ giỏ hàng', 'Đóng', {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'top'
    });
  }
}
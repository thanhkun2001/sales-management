import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product.model';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private items = signal<CartItem[]>([]);

  readonly cartItems = this.items.asReadonly();
  readonly totalItems = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );
  readonly totalPrice = computed(() =>
    this.items().reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  addItem(product: Product) {
    this.items.update(items => {
      const existing = items.find(i => i.productId === product.id);
      if (existing) {
        return items.map(i =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...items, {
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1
      }];
    });
  }

  removeItem(productId: string) {
    this.items.update(items => items.filter(i => i.productId !== productId));
  }

  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    this.items.update(items =>
      items.map(i => i.productId === productId ? { ...i, quantity } : i)
    );
  }

  clearCart() {
    this.items.set([]);
  }
}
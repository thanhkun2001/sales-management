import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {
  product = signal<Product | null>(null);
  loading = signal(true);
  quantity = signal(1);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/']);
      return;
    }

    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product.set(product);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
      }
    });
  }

  increaseQty() {
    const max = this.product()?.stock ?? 1;
    if (this.quantity() < max) {
      this.quantity.update(q => q + 1);
    }
  }

  decreaseQty() {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  onAddToCart() {
    const product = this.product();
    if (!product) return;

    for (let i = 0; i < this.quantity(); i++) {
      this.cartService.addItem(product);
    }

    this.snackBar.open(
      `✅ Đã thêm ${this.quantity()} sản phẩm vào giỏ hàng!`,
      'Đóng',
      { duration: 3000, horizontalPosition: 'end', verticalPosition: 'top' }
    );
  }
}
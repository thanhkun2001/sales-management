import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    ProductCardComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  products = signal<Product[]>([]);
  categories = signal<string[]>([]);
  loading = signal(false);
  total = signal(0);
  page = signal(0);
  limit = 12;

  searchControl = new FormControl('');
  categoryControl = new FormControl('');

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();

    // Search với debounce
    this.searchControl.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged(),
    ).subscribe(() => {
      this.page.set(0);
      this.loadProducts();
    });

    // Filter theo category
    this.categoryControl.valueChanges.subscribe(() => {
      this.page.set(0);
      this.loadProducts();
    });
  }

  loadProducts() {
    this.loading.set(true);
    this.productService.getProducts({
      search: this.searchControl.value || '',
      category: this.categoryControl.value || '',
      page: this.page() + 1,
      limit: this.limit,
    }).subscribe({
      next: (res) => {
        this.products.set(res.items);
        this.total.set(res.total);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats)
    });
  }

  onPageChange(event: PageEvent) {
    this.page.set(event.pageIndex);
    this.loadProducts();
  }

  onAddToCart(product: Product) {
    this.cartService.addItem(product);
  }

  clearFilters() {
    this.searchControl.setValue('');
    this.categoryControl.setValue('');
  }
}
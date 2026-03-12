import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class AdminProductsComponent implements OnInit {
  products = signal<Product[]>([]);
  loading = signal(true);
  showForm = signal(false);
  editingProduct = signal<Product | null>(null);
  saving = signal(false);

  categories = ['Điện thoại', 'Laptop', 'Tablet', 'Phụ kiện'];

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl(0, [Validators.required, Validators.min(1000)]),
    stock: new FormControl(0, Validators.required),
    category: new FormControl('', Validators.required),
    imageUrl: new FormControl(''),
  });

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading.set(true);
    this.http.get<any>(`${environment.apiUrl}/products?limit=100`).subscribe({
      next: (res) => {
        this.products.set(res.items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  openAddForm() {
    this.editingProduct.set(null);
    this.form.reset({ price: 0, stock: 0 });
    this.showForm.set(true);
  }

  openEditForm(product: Product) {
    this.editingProduct.set(product);
    this.form.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      imageUrl: product.imageUrl,
    });
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.editingProduct.set(null);
    this.form.reset();
  }

  onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const data = this.form.value;
    const editing = this.editingProduct();

    const request = editing
      ? this.http.put(`${environment.apiUrl}/products/${editing.id}`, data)
      : this.http.post(`${environment.apiUrl}/products`, data);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.closeForm();
        this.loadProducts();
        this.snackBar.open(
          editing ? '✅ Cập nhật sản phẩm thành công!' : '✅ Thêm sản phẩm thành công!',
          'Đóng', { duration: 3000, horizontalPosition: 'end', verticalPosition: 'top' }
        );
      },
      error: (err) => {
        this.saving.set(false);
        this.snackBar.open(err.userMessage || 'Có lỗi xảy ra', 'Đóng', { duration: 3000 });
      }
    });
  }

  onDelete(product: Product) {
    if (!confirm(`Xóa sản phẩm "${product.name}"?`)) return;

    this.http.delete(`${environment.apiUrl}/products/${product.id}`).subscribe({
      next: () => {
        this.loadProducts();
        this.snackBar.open('✅ Xóa sản phẩm thành công!', 'Đóng', { duration: 3000 });
      }
    });
  }
}
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class AdminOrdersComponent implements OnInit {
  orders = signal<any[]>([]);
  loading = signal(true);
  expandedOrder = signal<string | null>(null);

  statusOptions = [
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'shipping', label: 'Đang giao' },
    { value: 'delivered', label: 'Đã giao' },
    { value: 'cancelled', label: 'Đã hủy' },
  ];

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading.set(true);
    this.http.get<any>(`${environment.apiUrl}/orders?limit=50`).subscribe({
      next: (res) => {
        this.orders.set(res.items || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  toggleExpand(orderId: string) {
    this.expandedOrder.set(
      this.expandedOrder() === orderId ? null : orderId
    );
  }

  updateStatus(orderId: string, status: string) {
    this.http.put(`${environment.apiUrl}/orders/${orderId}/status`, { status }).subscribe({
      next: () => {
        this.orders.update(orders =>
          orders.map(o => o.id === orderId ? { ...o, status } : o)
        );
        this.snackBar.open('✅ Cập nhật trạng thái thành công!', 'Đóng', {
          duration: 3000, horizontalPosition: 'end', verticalPosition: 'top'
        });
      },
      error: () => {
        this.snackBar.open('Có lỗi xảy ra', 'Đóng', { duration: 3000 });
      }
    });
  }

  getStatusClass(status: string): string {
    const classes: any = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      shipping: 'status-shipping',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled',
    };
    return classes[status] || '';
  }

  getStatusLabel(status: string): string {
    return this.statusOptions.find(s => s.value === status)?.label || status;
  }
}
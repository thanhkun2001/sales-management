import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { OrderService } from '../../../core/services/order.service';
import { ProductService } from '../../../core/services/product.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  loading = signal(true);
  stats = signal({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    pendingOrders: 0,
  });
  recentOrders = signal<any[]>([]);

  constructor(
    private http: HttpClient,
  ) {}

  ngOnInit() {
    forkJoin({
      orders: this.http.get<any>(`${environment.apiUrl}/orders`),
      products: this.http.get<any>(`${environment.apiUrl}/products`),
    }).subscribe({
      next: ({ orders, products }) => {
        const allOrders = orders.items || [];
        this.stats.set({
          totalOrders: orders.total || 0,
          totalRevenue: allOrders.reduce((sum: number, o: any) => sum + Number(o.totalAmount), 0),
          totalProducts: products.total || 0,
          pendingOrders: allOrders.filter((o: any) => o.status === 'pending').length,
        });
        this.recentOrders.set(allOrders.slice(0, 5));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      pending: 'Chờ xử lý',
      confirmed: 'Đã xác nhận',
      shipping: 'Đang giao',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy',
    };
    return labels[status] || status;
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
}
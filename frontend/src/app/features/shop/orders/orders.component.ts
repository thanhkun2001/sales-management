import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  orders = signal<Order[]>([]);
  loading = signal(true);

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getMyOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
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

  getStatusColor(status: string): string {
    const colors: any = {
      pending: 'accent',
      confirmed: 'primary',
      shipping: 'primary',
      delivered: 'primary',
      cancelled: 'warn',
    };
    return colors[status] || 'default';
  }

  cancelOrder(id: string) {
    this.orderService.cancelOrder(id).subscribe({
      next: () => {
        this.orders.update(orders =>
          orders.map(o => o.id === id ? { ...o, status: 'cancelled' as any } : o)
        );
      }
    });
  }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateOrderDto, Order } from '../models/order.model';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly API = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  createOrder(dto: CreateOrderDto) {
    return this.http.post<Order>(this.API, dto);
  }

  getMyOrders() {
    return this.http.get<Order[]>(`${this.API}/my`);
  }

  getOrderById(id: string) {
    return this.http.get<Order>(`${this.API}/${id}`);
  }

  cancelOrder(id: string) {
    return this.http.put(`${this.API}/${id}/cancel`, {});
  }
}
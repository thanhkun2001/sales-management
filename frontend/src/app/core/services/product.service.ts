import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product, ProductFilter, ProductResponse } from '../models/product.model';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly API = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts(filter: ProductFilter = {}) {
    let params = new HttpParams();
    if (filter.search) params = params.set('search', filter.search);
    if (filter.category) params = params.set('category', filter.category);
    if (filter.page) params = params.set('page', filter.page.toString());
    if (filter.limit) params = params.set('limit', filter.limit.toString());
    return this.http.get<ProductResponse>(this.API, { params });
  }

  getProductById(id: string) {
    return this.http.get<Product>(`${this.API}/${id}`);
  }

  getCategories() {
    return this.http.get<string[]>(`${this.API}/categories`);
  }
}
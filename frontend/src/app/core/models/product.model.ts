export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: Date;
}

export interface ProductResponse {
  items: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ProductFilter {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}
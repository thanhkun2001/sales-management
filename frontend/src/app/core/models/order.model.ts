export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  totalAmount: number;
  status: OrderStatus;
  note: string;
  createdAt: Date;
}

export interface CreateOrderDto {
  items: { productId: string; quantity: number }[];
  shippingAddress: ShippingAddress;
  note?: string;
}
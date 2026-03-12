import 'reflect-metadata';
import { AppDataSource } from './database';
import { Product } from '../entities/Product';
import dotenv from 'dotenv';
dotenv.config();

const products = [
  { name: 'iPhone 15 Pro', description: 'Điện thoại Apple mới nhất', price: 29990000, stock: 50, category: 'Điện thoại', imageUrl: 'https://picsum.photos/seed/iphone/400/300' },
  { name: 'Samsung Galaxy S24', description: 'Flagship Android cao cấp', price: 22990000, stock: 30, category: 'Điện thoại', imageUrl: 'https://picsum.photos/seed/samsung/400/300' },
  { name: 'MacBook Pro M3', description: 'Laptop Apple chip M3', price: 49990000, stock: 20, category: 'Laptop', imageUrl: 'https://picsum.photos/seed/macbook/400/300' },
  { name: 'Dell XPS 15', description: 'Laptop cao cấp cho dân văn phòng', price: 35990000, stock: 15, category: 'Laptop', imageUrl: 'https://picsum.photos/seed/dell/400/300' },
  { name: 'AirPods Pro 2', description: 'Tai nghe không dây chống ồn', price: 6490000, stock: 100, category: 'Phụ kiện', imageUrl: 'https://picsum.photos/seed/airpods/400/300' },
  { name: 'iPad Air M2', description: 'Máy tính bảng Apple', price: 18990000, stock: 25, category: 'Tablet', imageUrl: 'https://picsum.photos/seed/ipad/400/300' },
  { name: 'Sony WH-1000XM5', description: 'Tai nghe chống ồn hàng đầu', price: 8490000, stock: 40, category: 'Phụ kiện', imageUrl: 'https://picsum.photos/seed/sony/400/300' },
  { name: 'Apple Watch Series 9', description: 'Đồng hồ thông minh Apple', price: 11990000, stock: 35, category: 'Phụ kiện', imageUrl: 'https://picsum.photos/seed/watch/400/300' },
];

AppDataSource.initialize().then(async () => {
  const repo = AppDataSource.getRepository(Product);
  await repo.save(products);
  console.log('✅ Seed data thành công!');
  process.exit(0);
}).catch(err => {
  console.error('❌ Lỗi:', err);
  process.exit(1);
});
import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import dotenv from 'dotenv';
import { Product } from '../entities/Product';
import { Order } from '../entities/Order';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'yourpassword',
  database: process.env.DB_NAME || 'sales_db',
  synchronize: true,   // ⚠️ chỉ dùng khi development
  logging: false,
  entities: [User,Product,Order],
});
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import authRouter from './modules/auth/auth.router';
import { errorMiddleware } from './middlewares/error.middleware';
import productsRouter from './modules/products/products.router';
import ordersRouter from './modules/orders/orders.router';
dotenv.config();

const app = express();

const corsOptions = {
  origin: ['http://localhost:4200', 'http://127.0.0.1:4200',process.env.FRONTEND_URL as string],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
// Health check
app.get('/api/health', (_, res) => res.json({ status: 'OK 🚀' }));

// Error handler (luôn đặt cuối cùng)
app.use(errorMiddleware);

// Khởi động
AppDataSource.initialize()
  .then(() => {
    console.log('✅ Database connected!');
    app.listen(process.env.PORT || 3000, () => {
      console.log(`🚀 Server: http://localhost:${process.env.PORT || 3000}/api`);
    });
  })
  .catch(err => {
    console.error('❌ Database lỗi:', err);
    process.exit(1);
  });


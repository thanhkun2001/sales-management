import { Request, Response } from 'express';
import * as ordersService from './orders.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

// POST /api/orders
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const order = await ordersService.createOrder(userId, req.body);
    res.status(201).json(order);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

// GET /api/orders/my
export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await ordersService.getMyOrders(req.user!.id);
    res.json(orders);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

// GET /api/orders/:id
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const order = await ordersService.getOrderById(req.params.id, req.user!.id);
    res.json(order);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

// PUT /api/orders/:id/cancel
export const cancelOrder = async (req: AuthRequest, res: Response) => {
  try {
    const result = await ordersService.cancelOrder(req.params.id, req.user!.id);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

// GET /api/orders (Admin)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;
    const result = await ordersService.getAllOrders(Number(page) || 1, Number(limit) || 10);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message });
  }
};

// PUT /api/orders/:id/status (Admin)
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const result = await ordersService.updateOrderStatus(req.params.id, req.body.status);
    res.json(result);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message });
  }
};
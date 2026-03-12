import { Router } from 'express';
import * as ordersController from './orders.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';

const router = Router();

// Customer routes (cần đăng nhập)
router.post('/', authMiddleware, ordersController.createOrder);
router.get('/my', authMiddleware, ordersController.getMyOrders);
router.get('/:id', authMiddleware, ordersController.getOrderById);
router.put('/:id/cancel', authMiddleware, ordersController.cancelOrder);

// Admin routes
router.get('/', authMiddleware, roleMiddleware('admin'), ordersController.getAllOrders);
router.put('/:id/status', authMiddleware, roleMiddleware('admin'), ordersController.updateOrderStatus);

export default router;
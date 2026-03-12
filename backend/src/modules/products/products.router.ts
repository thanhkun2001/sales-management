import { Router } from 'express';
import * as productsController from './products.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { roleMiddleware } from '../../middlewares/role.middleware';

const router = Router();

// Public routes
router.get('/', productsController.getProducts);
router.get('/categories', productsController.getCategories);
router.get('/:id', productsController.getProductById);

// Admin only
router.post('/', authMiddleware, roleMiddleware('admin'), productsController.createProduct);
router.put('/:id', authMiddleware, roleMiddleware('admin'), productsController.updateProduct);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), productsController.deleteProduct);

export default router;
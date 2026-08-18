import { Router } from 'express';
import {
  getProfile,
  getDashboard,
  getOrderById,
  updateOrderStatus
} from '../controller/delivery.controller.js';
import { isAuthMiddleware } from '../../../shared/middleware/auth-middleware.js';
import { hasRole } from '../../../shared/middleware/rbac-middleware.js';

const router = Router();

router.get('/profile', isAuthMiddleware, hasRole(['delivery', 'admin']), getProfile);
router.get('/dashboard', isAuthMiddleware, hasRole(['delivery', 'admin']), getDashboard);
router.get('/orders/:id', isAuthMiddleware, hasRole(['delivery', 'admin']), getOrderById);
router.patch('/orders/:id/status', isAuthMiddleware, hasRole(['delivery', 'admin']), updateOrderStatus);

export default router;

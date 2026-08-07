import { Router } from 'express';
import {
  getProfile,
  getDashboard,
  getOrderById,
  updateOrderStatus
} from '../controller/delivery.controller.js';

const router = Router();

router.get('/profile', getProfile);
router.get('/dashboard', getDashboard);
router.get('/orders/:id', getOrderById);
router.patch('/orders/:id/status', updateOrderStatus);

export default router;

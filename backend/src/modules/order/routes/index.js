import { Router } from 'express';
import customerRoutes from './customerRoutes.js';
import menuRoutes from './menuRoutes.js';
import orderRoutes from './orderRoutes.js';
import cartRoutes from './cartRoutes.js';
import couponRoutes from './couponRoutes.js';

const router = Router();

router.use('/customers', customerRoutes);
router.use('/menu', menuRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/coupons', couponRoutes);

export default router;

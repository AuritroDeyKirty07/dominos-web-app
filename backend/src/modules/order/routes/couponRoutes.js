import { Router } from 'express';
import * as couponController from '../controllers/couponController.js';

const router = Router();

router.get('/', couponController.getCoupons);
router.post('/validate', couponController.validateCoupon);

export default router;

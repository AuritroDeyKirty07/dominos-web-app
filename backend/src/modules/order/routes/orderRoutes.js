import { Router } from 'express';
import * as orderController from '../controllers/orderController.js';
import { validateOrder } from '../middleware/validator.js';
import { isAuthMiddleware } from '../../../shared/middleware/auth-middleware.js';
import { hasRole } from '../../../shared/middleware/rbac-middleware.js';

const router = Router();

router.use(isAuthMiddleware);
router.use(hasRole(['customer']));

router.post('/', validateOrder, orderController.createOrder);
router.get('/', orderController.getCustomerOrders);
router.get('/:orderId', orderController.getOrderById);
router.put('/:orderId/payment', orderController.updatePaymentStatus);

export default router;

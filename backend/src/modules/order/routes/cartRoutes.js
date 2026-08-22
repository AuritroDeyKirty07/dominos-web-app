import { Router } from 'express';
import * as cartController from '../controllers/cartController.js';
import { isAuthMiddleware } from '../../../shared/middleware/auth-middleware.js';
import { hasRole } from '../../../shared/middleware/rbac-middleware.js';

const router = Router();

router.use(isAuthMiddleware);
router.use(hasRole(['customer']));

router.get('/', cartController.getCart);
router.post('/sync', cartController.syncCart);
router.delete('/', cartController.clearCart);

export default router;

import { Router } from 'express';
import * as customerController from '../controllers/customerController.js';
import { validateAddress } from './validator.js';
import { isAuthMiddleware } from '../../../shared/middleware/auth-middleware.js';
import { hasRole } from '../../../shared/middleware/rbac-middleware.js';

const router = Router();

router.use(isAuthMiddleware);
router.use(hasRole(['customer']));

router.get('/profile', customerController.getProfile);
router.put('/profile', customerController.updateProfile);

router.get('/addresses', customerController.getAddresses);
router.post('/addresses', validateAddress, customerController.addAddress);
router.delete('/addresses/:addressId', customerController.deleteAddress);
router.put('/addresses/:addressId/default', customerController.setDefaultAddress);

export default router;

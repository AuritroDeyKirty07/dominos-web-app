import { Router } from 'express';
import adminMenuRoutes from './adminMenuRoutes.js';
import adminOrderRoutes from './adminOrderRoutes.js';
import adminAnalyticsRoutes from './adminAnalyticsRoutes.js';
import adminCustomerRoutes from './adminCustomerRoutes.js';
import adminEmployeeRoutes from './adminEmployeeRoutes.js';

const adminRouter = Router();

adminRouter.use('/menu', adminMenuRoutes);
adminRouter.use('/orders', adminOrderRoutes);
adminRouter.use('/analytics', adminAnalyticsRoutes);
adminRouter.use('/customers', adminCustomerRoutes);
adminRouter.use('/employees', adminEmployeeRoutes);

// Health check for admin API
adminRouter.get('/health', (req, res) => {
  res.json({ success: true, message: 'Admin API is running' });
});

export default adminRouter;

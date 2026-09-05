import { Router } from 'express';
import { userModel } from '../../auth/models/user-model.js';
import { CustomerOrder } from '../../order/models/CustomerOrder.js';
import { isAuthMiddleware } from '../../../shared/middleware/auth-middleware.js';
import { hasRole } from '../../../shared/middleware/rbac-middleware.js';

const router = Router();

// ─── GET /api/v1/admin/customers — List all users/customers ─────────────────
router.get('/', isAuthMiddleware, hasRole(['admin']), async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status !== undefined) {
      filter.isActive = status === 'true' || status === 'Active';
    }

    const users = await userModel.find(filter).populate('roleId').sort({ createdAt: -1 }).lean();

    // Enrich with order stats
    const enriched = await Promise.all(
      users.map(async (user) => {
        const orderStats = await CustomerOrder.aggregate([
          { $match: { customerId: user._id } },
          {
            $group: {
              _id: null,
              ordersCount: { $sum: 1 },
              totalSpent: { $sum: { $ifNull: ['$pricing.grandTotal', 0] } },
            },
          },
        ]);

        return {
          _id: user._id,
          customerId: user._id.toString(),
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.roleId?.name || 'customer',
          isActive: user.isActive,
          address: user.address?.[0]
            ? `${user.address[0].street || ''}, ${user.address[0].city || ''}`
            : '',
          city: user.address?.[0]?.city || 'Bengaluru',
          ordersCount: orderStats[0]?.ordersCount || 0,
          totalSpent: Math.round(orderStats[0]?.totalSpent || 0),
          loyaltyPoints: 0,
          joinedAt: user.createdAt,
          createdAt: user.createdAt,
        };
      })
    );

    return res.json({ success: true, count: enriched.length, data: enriched });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch customers', details: err.message });
  }
});

// ─── GET /api/v1/admin/customers/:id — Single customer detail ───────────────
router.get('/:id', isAuthMiddleware, hasRole(['admin']), async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).populate('roleId').lean();
    if (!user) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }

    // Get order history
    const orders = await CustomerOrder.find({ customerId: user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const orderStats = await CustomerOrder.aggregate([
      { $match: { customerId: user._id } },
      {
        $group: {
          _id: null,
          ordersCount: { $sum: 1 },
          totalSpent: { $sum: { $ifNull: ['$pricing.grandTotal', 0] } },
        },
      },
    ]);

    return res.json({
      success: true,
      data: {
        _id: user._id,
        customerId: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.roleId?.name || 'customer',
        isActive: user.isActive,
        address: user.address,
        ordersCount: orderStats[0]?.ordersCount || 0,
        totalSpent: Math.round(orderStats[0]?.totalSpent || 0),
        joinedAt: user.createdAt,
        recentOrders: orders,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch customer', details: err.message });
  }
});

// ─── PATCH /api/v1/admin/customers/:id/status — Toggle active status ────────
router.patch('/:id/status', isAuthMiddleware, hasRole(['admin']), async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      { $set: { isActive: Boolean(isActive) } },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ success: false, error: 'Customer not found' });
    }
    return res.json({ success: true, data: user });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to update customer status', details: err.message });
  }
});

export default router;

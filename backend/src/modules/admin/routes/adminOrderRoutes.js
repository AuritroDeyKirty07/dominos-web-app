import { Router } from 'express';
import { CustomerOrder } from '../../order/models/CustomerOrder.js';
import { isAuthMiddleware } from '../../../shared/middleware/auth-middleware.js';
import { hasRole } from '../../../shared/middleware/rbac-middleware.js';

const router = Router();

// ─── GET /api/v1/admin/orders — List all orders ─────────────────────────────
router.get('/', isAuthMiddleware, hasRole(['admin']), async (req, res) => {
  try {
    const { status, paymentStatus, limit } = req.query;
    const query = {};
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    let q = CustomerOrder.find(query).sort({ createdAt: -1 });
    if (limit) q = q.limit(Number(limit));

    const orders = await q.lean();

    // Map to a format the admin frontend expects
    const mapped = orders.map(order => ({
      _id: order._id,
      orderId: order.orderId,
      id: order.orderId,
      customerId: order.customerId,
      customerName: order.deliveryAddress?.name || 'Customer',
      phone: order.deliveryAddress?.phone || '',
      items: (order.items || []).map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        isVeg: item.isVeg,
        price: item.price,
        quantity: item.quantity,
        customization: item.customization,
        itemTotal: item.itemTotal,
      })),
      deliveryAddress: order.deliveryAddress,
      pricing: order.pricing,
      total: order.pricing?.grandTotal || 0,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      status: order.status,
      deliveryStatus: order.status,
      transactionId: order.transactionId,
      statusTimeline: order.statusTimeline,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }));

    return res.json({
      success: true,
      count: mapped.length,
      data: mapped,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch orders', details: err.message });
  }
});

// ─── GET /api/v1/admin/orders/:id — Single order detail ─────────────────────
router.get('/:id', isAuthMiddleware, hasRole(['admin']), async (req, res) => {
  try {
    const targetId = req.params.id;
    const order = await CustomerOrder.findOne({
      $or: [{ orderId: targetId }, { _id: targetId.length === 24 ? targetId : undefined }],
    }).lean();

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    return res.json({ success: true, data: order });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch order', details: err.message });
  }
});

// ─── PATCH /api/v1/admin/orders/:id/status — Update order status ────────────
router.patch('/:id/status', isAuthMiddleware, hasRole(['admin']), async (req, res) => {
  try {
    const { status } = req.body;
    const targetId = req.params.id;

    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required' });
    }

    const order = await CustomerOrder.findOneAndUpdate(
      { $or: [{ orderId: targetId }, { _id: targetId.length === 24 ? targetId : undefined }] },
      {
        $set: { status },
        $push: {
          statusTimeline: {
            status,
            timestamp: new Date(),
            description: `Status changed to ${status} by Admin`,
          },
        },
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    return res.json({
      success: true,
      orderId: targetId,
      newStatus: status,
      data: order,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to update order status', details: err.message });
  }
});

// ─── PATCH /api/v1/admin/orders/:id/cancel — Cancel order ───────────────────
router.patch('/:id/cancel', isAuthMiddleware, hasRole(['admin']), async (req, res) => {
  try {
    const targetId = req.params.id;

    const order = await CustomerOrder.findOneAndUpdate(
      { $or: [{ orderId: targetId }, { _id: targetId.length === 24 ? targetId : undefined }] },
      {
        $set: { status: 'CANCELLED', paymentStatus: 'REFUNDED' },
        $push: {
          statusTimeline: {
            status: 'CANCELLED',
            timestamp: new Date(),
            description: 'Order cancelled by Admin',
          },
        },
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    return res.json({
      success: true,
      orderId: targetId,
      status: 'CANCELLED',
      data: order,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to cancel order', details: err.message });
  }
});

export default router;

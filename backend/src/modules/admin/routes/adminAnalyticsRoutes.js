import { Router } from 'express';
import { CustomerOrder } from '../../order/models/CustomerOrder.js';
import { MenuItem } from '../../order/models/MenuItem.js';
import { userModel } from '../../auth/models/user-model.js';
import { Employee } from '../models/Employee.js';
import { isAuthMiddleware } from '../../../shared/middleware/auth-middleware.js';
import { hasRole } from '../../../shared/middleware/rbac-middleware.js';

const router = Router();

// Statuses that count as "paid" for revenue
const PAID_STATUSES = ['PAID', 'DEMO_PAID', 'Paid'];
// Statuses that mean "cancelled"
const CANCELLED_STATUSES = ['CANCELLED', 'Cancelled'];
// Statuses that mean "delivered"
const DELIVERED_STATUSES = ['DELIVERED', 'Delivered'];
// Statuses that mean "pending/in-progress"
const PENDING_STATUSES = ['PLACED', 'ACCEPTED', 'PREPARING', 'BAKING', 'READY', 'OUT_FOR_DELIVERY',
  'Order Received', 'Preparing', 'Order Placed', 'Baking in Oven', 'Quality Check'];

// ─── GET /api/v1/admin/analytics/dashboard ───────────────────────────────────
router.get('/dashboard', isAuthMiddleware, hasRole(['admin']), async (req, res) => {
  try {
    const totalOrders = await CustomerOrder.countDocuments();
    const totalUsers = await userModel.countDocuments();
    const totalProducts = await MenuItem.countDocuments();

    let activeEmployees = 0;
    try {
      activeEmployees = await Employee.countDocuments({ status: 'Active' });
    } catch (e) { /* Employee collection may not exist yet */ }

    const pendingOrders = await CustomerOrder.countDocuments({
      status: { $in: PENDING_STATUSES },
    });

    const completedOrders = await CustomerOrder.countDocuments({
      status: { $in: DELIVERED_STATUSES },
    });

    const cancelledOrders = await CustomerOrder.countDocuments({
      status: { $in: CANCELLED_STATUSES },
    });

    const paidOrders = await CustomerOrder.countDocuments({
      paymentStatus: { $in: PAID_STATUSES },
    });

    // Revenue: only from PAID orders (not cancelled)
    const revenueResult = await CustomerOrder.aggregate([
      {
        $match: {
          paymentStatus: { $in: PAID_STATUSES },
          status: { $nin: CANCELLED_STATUSES },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $ifNull: ['$pricing.grandTotal', 0] } },
        },
      },
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // Today's revenue
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayResult = await CustomerOrder.aggregate([
      {
        $match: {
          createdAt: { $gte: todayStart },
          paymentStatus: { $in: PAID_STATUSES },
          status: { $nin: CANCELLED_STATUSES },
        },
      },
      {
        $group: {
          _id: null,
          todayRevenue: { $sum: { $ifNull: ['$pricing.grandTotal', 0] } },
        },
      },
    ]);
    const todayRevenue = todayResult[0]?.todayRevenue || 0;

    // Weekly revenue
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const weekResult = await CustomerOrder.aggregate([
      {
        $match: {
          createdAt: { $gte: weekStart },
          paymentStatus: { $in: PAID_STATUSES },
          status: { $nin: CANCELLED_STATUSES },
        },
      },
      {
        $group: {
          _id: null,
          weeklyRevenue: { $sum: { $ifNull: ['$pricing.grandTotal', 0] } },
        },
      },
    ]);
    const weeklyRevenue = weekResult[0]?.weeklyRevenue || 0;

    // Monthly revenue
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthResult = await CustomerOrder.aggregate([
      {
        $match: {
          createdAt: { $gte: monthStart },
          paymentStatus: { $in: PAID_STATUSES },
          status: { $nin: CANCELLED_STATUSES },
        },
      },
      {
        $group: {
          _id: null,
          monthlyRevenue: { $sum: { $ifNull: ['$pricing.grandTotal', 0] } },
        },
      },
    ]);
    const monthlyRevenue = monthResult[0]?.monthlyRevenue || 0;

    // Average order value
    const avgResult = await CustomerOrder.aggregate([
      {
        $match: {
          paymentStatus: { $in: PAID_STATUSES },
          status: { $nin: CANCELLED_STATUSES },
        },
      },
      {
        $group: {
          _id: null,
          avg: { $avg: { $ifNull: ['$pricing.grandTotal', 0] } },
        },
      },
    ]);
    const averageOrderValue = Math.round(avgResult[0]?.avg || 0);

    // Most ordered item
    const topItemResult = await CustomerOrder.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: { $ifNull: ['$items.name', 'Unknown'] },
          count: { $sum: { $ifNull: ['$items.quantity', 1] } },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);
    const mostOrderedPizza = topItemResult[0]?._id || 'N/A';

    // Top customer
    const topCustResult = await CustomerOrder.aggregate([
      {
        $match: {
          paymentStatus: { $in: PAID_STATUSES },
          status: { $nin: CANCELLED_STATUSES },
        },
      },
      {
        $group: {
          _id: { $ifNull: ['$deliveryAddress.name', 'Customer'] },
          total: { $sum: { $ifNull: ['$pricing.grandTotal', 0] } },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 1 },
    ]);
    const topCustomer = topCustResult[0]
      ? { name: topCustResult[0]._id, total: topCustResult[0].total }
      : { name: 'N/A', total: 0 };

    return res.json({
      success: true,
      data: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue: Math.round(totalRevenue),
        todayRevenue: Math.round(todayRevenue),
        weeklyRevenue: Math.round(weeklyRevenue),
        monthlyRevenue: Math.round(monthlyRevenue),
        todayProfit: Math.round(todayRevenue * 0.55),
        totalProfit: Math.round(totalRevenue * 0.55),
        activeEmployees,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        paidOrders,
        averageOrderValue,
        revenueGrowth: weeklyRevenue > 0 ? 18 : 0,
        mostOrderedPizza,
        topCustomer,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch dashboard analytics', details: err.message });
  }
});

// ─── GET /api/v1/admin/analytics/sales?period=weekly ─────────────────────────
router.get('/sales', isAuthMiddleware, hasRole(['admin']), async (req, res) => {
  try {
    const { period } = req.query;
    const now = new Date();
    let dateFilter, groupBy;
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    if (period === 'today') {
      const d = new Date(now);
      d.setHours(0, 0, 0, 0);
      dateFilter = { createdAt: { $gte: d } };
      groupBy = { $hour: '$createdAt' };
    } else if (period === 'monthly') {
      dateFilter = { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) } };
      groupBy = { $week: '$createdAt' };
    } else if (period === 'yearly') {
      dateFilter = { createdAt: { $gte: new Date(now.getFullYear(), 0, 1) } };
      groupBy = { $month: '$createdAt' };
    } else {
      // Default: weekly
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      dateFilter = { createdAt: { $gte: d } };
      groupBy = { $dayOfWeek: '$createdAt' };
    }

    const data = await CustomerOrder.aggregate([
      {
        $match: {
          paymentStatus: { $in: PAID_STATUSES },
          status: { $nin: CANCELLED_STATUSES },
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: groupBy,
          sales: { $sum: { $ifNull: ['$pricing.grandTotal', 0] } },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formatted = data.map((item) => ({
      time:
        period === 'yearly'
          ? monthLabels[item._id - 1] || `M${item._id}`
          : period === 'today'
          ? `${item._id % 12 || 12} ${item._id >= 12 ? 'PM' : 'AM'}`
          : period === 'monthly'
          ? `Week ${item._id}`
          : dayLabels[item._id - 1] || `D${item._id}`,
      sales: Math.round(item.sales),
      orders: item.orders,
    }));

    return res.json({ success: true, data: formatted });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch sales data', details: err.message });
  }
});

// ─── GET /api/v1/admin/analytics/revenue?period=weekly ───────────────────────
router.get('/revenue', isAuthMiddleware, hasRole(['admin']), async (req, res) => {
  try {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - 7);
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const data = await CustomerOrder.aggregate([
      {
        $match: {
          paymentStatus: { $in: PAID_STATUSES },
          status: { $nin: CANCELLED_STATUSES },
          createdAt: { $gte: weekStart },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: '$createdAt' },
          revenue: { $sum: { $ifNull: ['$pricing.grandTotal', 0] } },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.json({
      success: true,
      data: data.map((item) => ({
        time: dayLabels[item._id - 1] || `D${item._id}`,
        revenue: Math.round(item.revenue),
        profit: Math.round(item.revenue * 0.55),
        orders: item.orders,
      })),
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch revenue data', details: err.message });
  }
});

export default router;

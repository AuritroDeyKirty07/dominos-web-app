import { CustomerOrder } from '../models/CustomerOrder.js';
import KitchenOrder from '../../kitchen/models/Order.js';
import { userModel } from '../../auth/models/user-model.js';
import { calculateCartTotals, calculateVerifiedItemUnitPrice } from './cartService.js';
import { ORDER_STATUS } from './constants.js';

// Status mapping helper: Kitchen Status -> Customer Status
const mapKitchenStatusToCustomer = (kitchenStatus) => {
  switch (kitchenStatus) {
    case 'Placed':
      return ORDER_STATUS.PLACED;
    case 'Preparing':
      return ORDER_STATUS.PREPARING;
    case 'Ready':
      return ORDER_STATUS.QUALITY_CHECK;
    case 'Out for Delivery':
      return ORDER_STATUS.OUT_FOR_DELIVERY;
    case 'Delivered':
      return ORDER_STATUS.DELIVERED;
    default:
      return ORDER_STATUS.PLACED;
  }
};

const getTimelineName = (status) => {
  switch (status) {
    case ORDER_STATUS.PLACED:
      return 'Order Placed';
    case ORDER_STATUS.PREPARING:
      return 'Preparing in Kitchen';
    case ORDER_STATUS.QUALITY_CHECK:
      return 'Quality Check';
    case ORDER_STATUS.OUT_FOR_DELIVERY:
      return 'Out for Delivery';
    case ORDER_STATUS.DELIVERED:
      return 'Delivered';
    default:
      return 'Order Placed';
  }
};

const getTimelineDescription = (status) => {
  switch (status) {
    case ORDER_STATUS.PLACED:
      return 'Order confirmed and sent to Domino’s kitchen.';
    case ORDER_STATUS.PREPARING:
      return 'Pizzas are being hand-tossed and prepared by our chef.';
    case ORDER_STATUS.QUALITY_CHECK:
      return 'Baked at 245°C. Quality check done and thermal bag sealed.';
    case ORDER_STATUS.OUT_FOR_DELIVERY:
      return 'Rider has picked up the order and is on the way.';
    case ORDER_STATUS.DELIVERED:
      return 'Order delivered warm to your doorstep. Enjoy your meal!';
    default:
      return 'Order in progress.';
  }
};

export const createOrder = async (orderPayload, customerId) => {
  const orderId = `DOM-${Math.floor(10000 + Math.random() * 90000)}`;
  const now = new Date();

  // 1. Calculate & verify pricing
  const rawItems = orderPayload.items || [];
  const items = rawItems.map(item => {
    const verifiedUnitPrice = calculateVerifiedItemUnitPrice(item);
    return {
      ...item,
      price: verifiedUnitPrice,
      itemTotal: verifiedUnitPrice * (item.quantity || 1),
    };
  });

  const discount = orderPayload.pricing?.discount || 0;
  const computedPricing = calculateCartTotals(items, discount);

  const finalPricing = {
    subtotal: computedPricing.subtotal,
    discount: computedPricing.discount,
    couponCode: orderPayload.pricing?.couponCode || null,
    deliveryFee: computedPricing.deliveryFee,
    tax: computedPricing.taxes,
    grandTotal: computedPricing.grandTotal,
  };

  const isDemoPaid = orderPayload.paymentStatus === 'DEMO_PAID' || 
                     orderPayload.paymentStatus === 'Paid' || 
                     orderPayload.paymentStatus === 'PAID' ||
                     orderPayload.paymentMethod?.includes('Online') || 
                     orderPayload.paymentMethod?.includes('Razorpay');

  // 2. Fetch customer name from user model
  const user = await userModel.findById(customerId);
  const customerName = user ? user.name : 'Valued Customer';

  // 3. Create the detailed CustomerOrder
  const newCustomerOrder = {
    orderId,
    customerId,
    items,
    deliveryAddress: orderPayload.deliveryAddress,
    pricing: finalPricing,
    paymentMethod: orderPayload.paymentMethod || 'Cash on Delivery',
    paymentStatus: isDemoPaid ? 'PAID' : 'PENDING',
    transactionId: orderPayload.transactionId || (isDemoPaid ? `pay_demo_${Date.now()}` : null),
    deliveryInstructions: orderPayload.deliveryInstructions || '',
    estimatedDeliveryMinutes: 30,
    status: ORDER_STATUS.PLACED,
    statusTimeline: [
      {
        status: 'Order Placed',
        timestamp: now,
        description: 'Order confirmed and sent to Domino’s kitchen.',
      },
    ],
  };

  const customerOrderDoc = new CustomerOrder(newCustomerOrder);
  await customerOrderDoc.save();

  // 4. Create the simplified Kitchen Order (Team 3)
  const kitchenItems = rawItems.map(item => ({
    name: item.name,
    quantity: item.quantity,
  }));

  const newKitchenOrder = {
    orderNumber: orderId,
    customerName,
    items: kitchenItems,
    status: 'Placed',
  };

  const kitchenOrderDoc = new KitchenOrder(newKitchenOrder);
  await kitchenOrderDoc.save();

  return customerOrderDoc.toObject();
};

export const getOrderById = async (orderId, customerId) => {
  const customerOrder = await CustomerOrder.findOne({ orderId, customerId });
  if (!customerOrder) return null;

  // Sync status dynamically from Kitchen Order
  try {
    const kitchenOrder = await KitchenOrder.findOne({ orderNumber: orderId });
    if (kitchenOrder) {
      const mappedStatus = mapKitchenStatusToCustomer(kitchenOrder.status);
      if (customerOrder.status !== mappedStatus) {
        customerOrder.status = mappedStatus;
        const timelineName = getTimelineName(mappedStatus);
        
        // Add to statusTimeline if it doesn't already exist
        if (!customerOrder.statusTimeline.some(t => t.status === timelineName)) {
          customerOrder.statusTimeline.push({
            status: timelineName,
            timestamp: new Date(),
            description: getTimelineDescription(mappedStatus),
          });
        }

        await CustomerOrder.updateOne(
          { orderId, customerId },
          { $set: { status: mappedStatus, statusTimeline: customerOrder.statusTimeline } }
        );
      }
    }
  } catch (err) {
    console.error('Failed to sync status from Kitchen Order:', err.message);
  }

  return customerOrder.toObject();
};

export const getOrdersByCustomerId = async (customerId) => {
  const customerOrders = await CustomerOrder.find({ customerId }).sort({ createdAt: -1 });
  
  // Sync status for each order
  const syncedOrders = [];
  for (const order of customerOrders) {
    try {
      const kitchenOrder = await KitchenOrder.findOne({ orderNumber: order.orderId });
      if (kitchenOrder) {
        const mappedStatus = mapKitchenStatusToCustomer(kitchenOrder.status);
        if (order.status !== mappedStatus) {
          order.status = mappedStatus;
          const timelineName = getTimelineName(mappedStatus);
          
          if (!order.statusTimeline.some(t => t.status === timelineName)) {
            order.statusTimeline.push({
              status: timelineName,
              timestamp: new Date(),
              description: getTimelineDescription(mappedStatus),
            });
          }
          await CustomerOrder.updateOne(
            { orderId: order.orderId, customerId },
            { $set: { status: mappedStatus, statusTimeline: order.statusTimeline } }
          );
        }
      }
    } catch (err) {
      console.error(`Failed to sync status for order ${order.orderId}:`, err.message);
    }
    syncedOrders.push(order.toObject());
  }

  return syncedOrders;
};

export const updateOrderPaymentStatus = async (orderId, paymentStatus, transactionId = null) => {
  const updates = { paymentStatus };
  if (transactionId) updates.transactionId = transactionId;

  const order = await CustomerOrder.findOneAndUpdate(
    { orderId },
    { $set: updates },
    { new: true }
  );

  return order ? order.toObject() : null;
};

import Order from "../models/Order.js";

export const getOrdersService = async (status) => {
    const filter = {};

    if (status) {
        filter.status = status;
    }

    const orders = await Order.find(filter).sort({
        createdAt: 1
    });

    return orders;
};


export const startPreparingService = async (orderId) => {
    const order = await Order.findById(orderId);

    if (!order) {
        throw new Error("Order not found");
    }

    order.status = "preparing";

    await order.save();

    return order;
};


export const markReadyService = async (orderId) => {
    const order = await Order.findById(orderId);

    if (!order) {
        throw new Error("Order not found");
    }

    order.status = "ready";

    await order.save();

    return order;
};
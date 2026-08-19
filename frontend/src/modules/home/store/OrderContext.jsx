import React, { createContext, useState, useEffect } from 'react';
import * as orderService from '../services/orderService.js';

export const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const list = await orderService.getOrders();
      setOrders(list);

      // Check if there is an in-flight order (not DELIVERED or CANCELLED)
      const currentActive = list.find(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
      if (currentActive) {
        setActiveOrder(currentActive);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handlePlaceOrder = async (orderPayload) => {
    const created = await orderService.placeOrder(orderPayload);
    setOrders(prev => [created, ...prev]);
    setActiveOrder(created);
    return created;
  };

  const getOrderDetails = async (orderId) => {
    const details = await orderService.getOrderById(orderId);
    if (details) {
      // Update local state if modified
      setOrders(prev => prev.map(o => o.orderId === orderId ? details : o));
      if (activeOrder?.orderId === orderId) {
        setActiveOrder(details);
      }
    }
    return details;
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        activeOrder,
        isLoading,
        placeOrder: handlePlaceOrder,
        getOrderDetails,
        refreshOrders: fetchOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

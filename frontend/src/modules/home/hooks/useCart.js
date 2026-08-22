import { useContext } from 'react';
import { CartContext } from '../store/CartContext.jsx';

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

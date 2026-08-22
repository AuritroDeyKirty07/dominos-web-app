import React from 'react';
import Navbar from './shared/components/Navbar';
import AppRoutes from './routes/AppRoutes';
import { CustomerProvider } from './modules/home/store/CustomerContext.jsx';
import { CartProvider } from './modules/home/store/CartContext.jsx';
import { OrderProvider } from './modules/home/store/OrderContext.jsx';

function App() {
  return (
    <CustomerProvider>
      <CartProvider>
        <OrderProvider>
          <div>
            <Navbar />
            <AppRoutes />
          </div>
        </OrderProvider>
      </CartProvider>
    </CustomerProvider>
  );
}

export default App;

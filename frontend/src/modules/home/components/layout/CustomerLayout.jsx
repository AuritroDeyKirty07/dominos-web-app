import React from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Footer } from './Footer.jsx';
import { useCart } from '../../hooks/useCart.js';
import { formatCurrency } from '../../utils/formatters.js';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../../../shared/store/authStore.js';

export const CustomerLayout = () => {
  const { totalItemsCount, grandTotal } = useCart();
  const location = useLocation();

  // Hide mobile floating bar on Cart and Checkout pages
  const hideFloatingCart = location.pathname === '/cart' || location.pathname === '/checkout';
  const { role } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">

      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* Floating Mobile Cart Bar */}
      {role !== 'admin' && !hideFloatingCart && totalItemsCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl md:hidden">
          <Link
            to="/cart"
            className="flex items-center justify-between px-4 py-3 bg-dominos-red text-white rounded-xl shadow-dominos-red font-bold"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-red-100 font-medium">{totalItemsCount} {totalItemsCount === 1 ? 'Item' : 'Items'} Added</p>
                <p className="text-sm font-black">{formatCurrency(grandTotal)}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-white/10 px-3 py-1.5 rounded-lg">
              <span>View Cart</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      )}

      <Footer />
    </div>
  );
};

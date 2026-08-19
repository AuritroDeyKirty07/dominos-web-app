import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCustomer } from '../../services/useCustomer.js';
import { useCart } from '../../services/useCart.js';
import { useOrders } from '../../services/useOrders.js';
import { LocationSelectorModal } from './LocationSelectorModal.jsx';
import { formatCurrency } from '../../services/formatters.js';
import {
  Pizza,
  ShoppingBag,
  MapPin,
  Tag,
  Clock,
  Menu as MenuIcon,
  X,
  ChevronDown,
  User,
  Sparkles,
  Award,
} from 'lucide-react';

export const Navbar = () => {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { profile, selectedAddress, deliveryMode } = useCustomer();
  const { totalItemsCount, grandTotal } = useCart();
  const { activeOrder } = useOrders();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Categories', path: '/categories' },
    { name: 'Offers & Deals', path: '/offers', badge: '50% OFF' },
    { name: 'Order History', path: '/orders' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        {/* Top announcement bar */}
        <div className="bg-dominos-dark text-slate-200 text-xs py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium">
              <span className="bg-dominos-red text-white text-[10px] uppercase font-black px-1.5 py-0.5 rounded tracking-wide">
                Offer
              </span>
              <span>Use code <strong className="text-white">DOMINOS50</strong> for 50% OFF on your favorite pizzas!</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-slate-300 text-xs">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Award className="w-3.5 h-3.5" />
                <span>{profile?.loyaltyPoints || 420} Cheesy Points</span>
              </div>
              <span>•</span>
              <span>Delivery Guarantee: 30 Mins or Free*</span>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Brand Logo & Location */}
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
                <div className="w-10 h-10 bg-dominos-blue rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-5 h-5 bg-dominos-red rounded-bl-xl" />
                  <Pizza className="w-6 h-6 text-white relative z-10" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black font-brand tracking-wider text-dominos-blue leading-none">
                    DOMINO'S<span className="text-dominos-red">.</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Hot & Fresh Pizza
                  </span>
                </div>
              </Link>

              {/* Location / Order Type Selector Pill */}
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-slate-200 hover:border-dominos-blue/40 bg-slate-50 hover:bg-white transition-all text-left group max-w-xs"
              >
                <div className="p-1 rounded-full bg-dominos-red/10 text-dominos-red group-hover:scale-110 transition-transform">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex flex-col truncate">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {deliveryMode === 'delivery' ? 'Deliver to' : 'Takeaway from'}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-dominos-blue" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800 truncate max-w-[170px]">
                    {deliveryMode === 'delivery'
                      ? (selectedAddress ? `${selectedAddress.type}: ${selectedAddress.addressLine1}` : 'Select Address')
                      : 'Indiranagar 100 Ft Store'}
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all relative ${
                      active
                        ? 'text-dominos-blue bg-dominos-blue/10'
                        : 'text-slate-700 hover:text-dominos-blue hover:bg-slate-50'
                    }`}
                  >
                    {link.name}
                    {link.badge && (
                      <span className="ml-1.5 text-[10px] font-black bg-dominos-red text-white px-1.5 py-0.5 rounded-full uppercase">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Actions: Live Tracking / Customer Profile / Cart */}
            <div className="flex items-center gap-3">
              {/* Active Order Pill if present */}
              {activeOrder && activeOrder.status !== 'DELIVERED' && (
                <button
                  onClick={() => navigate(`/orders/${activeOrder.orderId}/track`)}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors animate-pulse"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tracking: #{activeOrder.orderId}</span>
                </button>
              )}

              {/* Customer Account Button */}
              <Link
                to="/addresses"
                className="hidden sm:flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 transition-all"
                title="Customer Profile & Addresses"
              >
                <div className="w-7 h-7 rounded-full bg-dominos-blue/10 text-dominos-blue flex items-center justify-center font-bold text-xs">
                  {profile?.name ? profile.name.charAt(0) : 'A'}
                </div>
                <span className="text-xs font-semibold text-slate-800 pr-1">
                  {profile?.name?.split(' ')[0] || 'Account'}
                </span>
              </Link>

              {/* Cart Button */}
              <Link
                to="/cart"
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-dominos-red text-white hover:bg-dominos-red-dark transition-all shadow-md hover:shadow-dominos-red font-bold text-sm"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  {totalItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-dominos-red rounded-full text-[11px] font-black flex items-center justify-center shadow-sm">
                      {totalItemsCount}
                    </span>
                  )}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] uppercase tracking-wider text-red-100 leading-none">Cart</span>
                  <span className="text-xs font-extrabold leading-tight">
                    {totalItemsCount > 0 ? formatCurrency(grandTotal) : '₹0'}
                  </span>
                </div>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 lg:hidden"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
            <button
              onClick={() => {
                setIsLocationModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-left"
            >
              <MapPin className="w-5 h-5 text-dominos-red flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 font-medium">Order Type & Location</p>
                <p className="text-sm font-bold text-slate-800 truncate">
                  {deliveryMode === 'delivery'
                    ? (selectedAddress ? `${selectedAddress.type}: ${selectedAddress.addressLine1}` : 'Select Address')
                    : 'Indiranagar Takeaway'}
                </p>
              </div>
            </button>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-3 rounded-xl text-sm font-semibold flex items-center justify-between ${
                    isActive(link.path)
                      ? 'bg-dominos-blue text-white'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[10px] bg-dominos-red text-white px-1.5 py-0.5 rounded font-black">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <Link
                to="/addresses"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-semibold text-slate-700"
              >
                <User className="w-4 h-4 text-dominos-blue" />
                <span>My Profile & Addresses</span>
              </Link>
              <div className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                {profile?.loyaltyPoints || 420} Pts
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Location Modal */}
      <LocationSelectorModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </>
  );
};


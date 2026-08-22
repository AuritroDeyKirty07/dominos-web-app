import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { CartContext } from '../../modules/home/store/CartContext.jsx';
import { CustomerContext } from '../../modules/home/store/CustomerContext.jsx';
import { LocationSelectorModal } from '../../modules/home/components/layout/LocationSelectorModal.jsx';
import { Pizza, ShoppingBag, MapPin, ChevronDown, Award, User } from 'lucide-react';
import './Navbar.css';

const formatCurrency = (amount) => {
  const value = Math.round(amount || 0);
  return `₹${value.toLocaleString('en-IN')}`;
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const { isAuthenticated, role } = useAuthStore();
  const isLoggedIn = isAuthenticated;

  // Conditionally consume Customer contexts
  const cart = useContext(CartContext);
  const customer = useContext(CustomerContext);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const totalItemsCount = cart ? cart.totalItemsCount : 0;
  const grandTotal = cart ? cart.grandTotal : 0;
  const profile = customer ? customer.profile : null;
  const selectedAddress = customer ? customer.selectedAddress : null;
  const deliveryMode = customer ? customer.deliveryMode : 'delivery';

  // If user is a customer, render the rich customer navbar
  if (isLoggedIn && role === 'customer') {
    const navLinks = [
      { name: 'Home', path: '/' },
      { name: 'Menu', path: '/menu' },
      { name: 'Categories', path: '/categories' },
      { name: 'Offers & Deals', path: '/offers' },
      { name: 'Order History', path: '/orders' },
    ];

    const points = profile?.loyaltyPoints || 420;

    return (
      <>
        {/* Customer Top Announcement Bar */}
        <div className="bg-[#0C1E28] text-slate-200 text-xs py-1.5 px-4 font-sans">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-[#E31837] text-white text-[10px] uppercase font-black px-1.5 py-0.5 rounded tracking-wide">
                Offer
              </span>
              <span>Use code <strong className="text-white">DOMINOS50</strong> for 50% OFF on your favorite pizzas!</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-slate-300">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Award className="w-3.5 h-3.5" />
                <span>{points} Cheesy Points</span>
              </div>
              <span>•</span>
              <span>Delivery Guarantee: 30 Mins or Free*</span>
            </div>
          </div>
        </div>

        {/* Main Customer Header */}
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm font-sans w-full">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[70px]">
            {/* Brand Logo & Location */}
            <div className="flex items-center gap-6">
                <Link to="/" className="flex items-center gap-2 group flex-shrink-0" style={{ textDecoration: 'none' }}>
                  <div className="w-10 h-10 bg-[#006491] rounded-xl flex items-center justify-center shadow-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-5 h-5 bg-[#E31837] rounded-bl-xl" />
                    <Pizza className="w-6 h-6 text-white relative z-10" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl sm:text-2xl font-black tracking-wider text-[#006491] leading-none">
                      DOMINO'S<span className="text-[#E31837]">.</span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Hot & Fresh Pizza
                    </span>
                  </div>
                </Link>

                {/* Location / Order Type Selector Pill */}
                <button
                  onClick={() => setIsLocationModalOpen(true)}
                  className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-slate-200 hover:border-[#006491]/40 bg-slate-50 hover:bg-white transition-all text-left group max-w-xs cursor-pointer"
                >
                  <div className="p-1 rounded-full bg-[#E31837]/10 text-[#E31837]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col truncate">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {deliveryMode === 'delivery' ? 'Deliver to' : 'Takeaway from'}
                      </span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
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
                  const active = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all relative ${
                        active
                          ? 'text-[#006491] bg-[#006491]/10'
                          : 'text-slate-700 hover:text-[#006491] hover:bg-slate-50'
                      }`}
                      style={{ textDecoration: 'none' }}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>

              {/* Actions: Profile & Cart */}
              <div className="flex items-center gap-3">
                {/* Customer Account Profile Dropdown */}
                <div className="relative group hidden sm:block">
                  <div className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 transition-all cursor-pointer">
                    <div className="w-7 h-7 rounded-full bg-[#006491]/10 text-[#006491] flex items-center justify-center font-bold text-xs">
                      {profile?.name ? profile.name.charAt(0) : 'A'}
                    </div>
                    <span className="text-xs font-semibold text-slate-800 pr-1">
                      {profile?.name?.split(' ')[0] || 'Account'}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400 group-hover:rotate-180 transition-transform duration-300" />
                  </div>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden transform origin-top-right group-hover:scale-100 scale-95">
                    <div className="py-2">
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#006491] transition-colors"
                        style={{ textDecoration: 'none' }}
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                      <Link 
                        to="/addresses" 
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#006491] transition-colors"
                        style={{ textDecoration: 'none' }}
                      >
                        <MapPin className="w-4 h-4" />
                        Saved Addresses
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Cart Button */}
                <Link
                  to="/cart"
                  className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-[#E31837] text-white hover:bg-[#b8122c] transition-all shadow-md font-bold text-sm"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <ShoppingBag className="w-5 h-5" />
                      {totalItemsCount > 0 && (
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-[#E31837] rounded-full text-[10px] font-black flex items-center justify-center shadow-sm">
                          {totalItemsCount}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] uppercase tracking-wider text-red-100 leading-none mb-0.5">
                        {totalItemsCount} {totalItemsCount === 1 ? 'Item' : 'Items'} Added
                      </span>
                      <span className="text-sm font-extrabold leading-tight">
                        {totalItemsCount > 0 ? formatCurrency(grandTotal) : '₹0'}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
          </div>
        </header>

        <LocationSelectorModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
        />
      </>
    );
  }

  // Fallback to default shared Navbar for non-customer roles (Cook, Delivery Rider, Admin) or unauthenticated views
  return (
    <nav className="main-navbar">
      <div className="navbar-left">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span className="brand-text">Dominos</span>
        </Link>
      </div>

      <div className="navbar-right">
        {role !== 'cook' && role !== 'delivery' && role !== 'admin' && (
          <Link to="/menu" className="nav-link">
            Menu
          </Link>
        )}
        
        {/* Admin Navigation Links */}
        {role === 'admin' && (
          <>
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/menu" className="nav-link">Menu</Link>
            <Link to="/categories" className="nav-link">Categories</Link>
            <Link to="/offers" className="nav-link">Offers & Deals</Link>
            <Link to="/profile" className="nav-link">Dashboard</Link>
          </>
        )}

        {isLoggedIn && role === 'customer' && (
          <Link to="/cart" className="nav-link">
            Cart
          </Link>
        )}
        {role === 'cook' && (
          <Link to="/kitchen" className="nav-link">
            Dashboard
          </Link>
        )}
        {role === 'delivery' && (
          <Link to="/delivery" className="nav-link">
            Dashboard
          </Link>
        )}
        {!isLoggedIn && (
          <button
            className={`nav-btn ${currentPath === '/register' ? 'active' : ''}`}
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        )}

        {!isLoggedIn && (
          <button
            className={`nav-btn ${currentPath === '/login' ? 'active' : ''}`}
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        )}

        {isLoggedIn && (
          <div
            className="profile-icon"
            title="My Profile"
            onClick={() => navigate('/profile')}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        )}
      </div>
    </nav>
  );
}

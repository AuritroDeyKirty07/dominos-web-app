import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { useCustomer } from '../hooks/useCustomer.js';
import { Button } from '../components/common/Button.jsx';
import { VegBadge } from '../components/common/VegBadge.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { formatCurrency } from '../utils/formatters.js';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Tag,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  MapPin,
  Sparkles,
} from 'lucide-react';

const upsellItems = [
  {
    id: 'stuffed-garlic-bread',
    name: 'Stuffed Garlic Bread',
    price: 159,
    isVeg: true,
    image: 'https://www.indianveggiedelight.com/wp-content/uploads/2017/03/dominos_stuffed_garlic_bread_final.jpg',
  },
  {
    id: 'choco-lava-cake',
    name: 'Choco Lava Cake',
    price: 119,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'pepsi-500ml',
    name: 'Pepsi Pet Bottle (500ml)',
    price: 60,
    isVeg: true,
    image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=300&q=80',
  },
];

export const CartPage = () => {
  const {
    cartItems,
    subtotal,
    discount,
    deliveryFee,
    taxes,
    grandTotal,
    appliedCoupon,
    couponError,
    couponSuccess,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
    clearCart,
    addToCart,
  } = useCart();

  const { selectedAddress } = useCustomer();
  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    applyCoupon(couponInput.trim());
  };

  if (cartItems.length === 0) {
    return (
      <div className="w-full px-[5%] py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your Cart is Empty"
          description="Good food is always just a few clicks away. Explore our menu to add mouth-watering pizzas and garlic breadsticks."
          actionText="Explore Domino's Menu"
          onAction={() => navigate('/menu')}
          secondaryActionText="View Today's Offers"
          onSecondaryAction={() => navigate('/offers')}
        />
      </div>
    );
  }

  return (
    <div className="w-full px-[5%] py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-black font-brand text-slate-900 tracking-wide">
            MY SHOPPING CART
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Review your customized items, apply discount coupons & proceed
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-bold text-slate-400 hover:text-dominos-red transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List & Upsell */}
        <div className="lg:col-span-8 space-y-6">
          {/* Cart Item Cards */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
            {cartItems.map((item) => {
              const custom = item.customization;
              const itemTotal = item.unitPrice * item.quantity;

              return (
                <div key={item.cartItemId} className="p-4 sm:p-5 flex items-start gap-4 transition-colors hover:bg-slate-50/50">
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5">
                      <VegBadge isVeg={item.isVeg} size="sm" />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-base text-slate-900 font-brand truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs text-slate-600 font-semibold mt-0.5">
                          {formatCurrency(item.unitPrice)} each
                        </p>
                      </div>
                      <span className="font-black text-base text-slate-900 font-brand">
                        {formatCurrency(itemTotal)}
                      </span>
                    </div>

                    {/* Customization Badges */}
                    {custom && (
                      <div className="mt-2 text-xs text-slate-500 space-y-0.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <p className="font-semibold text-slate-700">
                          {custom.size} • {custom.crust}
                        </p>
                        {custom.toppings && custom.toppings.length > 0 && (
                          <p className="text-slate-500 truncate">
                            <strong className="text-slate-600">Toppings:</strong> {custom.toppings.join(', ')}
                          </p>
                        )}
                        {custom.addOns && custom.addOns.length > 0 && (
                          <p className="text-slate-500 truncate">
                            <strong className="text-slate-600">Dips:</strong> {custom.addOns.join(', ')}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Quantity Stepper & Remove */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-slate-200 rounded-xl p-1 bg-white shadow-sm">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, -1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-xs text-slate-400 hover:text-dominos-red transition-colors flex items-center gap-1 font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Upsell / Add-ons Strip */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-1.5 text-dominos-blue text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Complete Your Meal with Popular Additions</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {upsellItems.map((up) => (
                <div
                  key={up.id}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-all"
                >
                  <img
                    src={up.image}
                    alt={up.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{up.name}</p>
                    <p className="text-xs font-black text-dominos-blue">{formatCurrency(up.price)}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addToCart(up, null, 1)}
                    className="px-2.5 py-1 text-xs font-bold"
                  >
                    + ADD
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Coupon & Bill Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Apply Promo Code Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <Tag className="w-4 h-4 text-dominos-red" />
                <span>Apply Coupon</span>
              </div>
              <Link to="/offers" className="text-xs font-bold text-dominos-blue hover:underline">
                View All
              </Link>
            </div>

            {appliedCoupon ? (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-black text-emerald-800">{appliedCoupon.code} Applied</p>
                    <p className="text-[11px] text-emerald-600 font-medium">You save {formatCurrency(discount)}</p>
                  </div>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs font-bold text-dominos-red hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Code (e.g. DOMINOS50)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold uppercase placeholder:normal-case placeholder:font-normal focus:outline-none focus:border-dominos-blue"
                />
                <Button variant="primary" type="submit" size="sm" className="font-bold text-xs">
                  Apply
                </Button>
              </form>
            )}

            {couponError && (
              <p className="text-xs text-dominos-red font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{couponError}</span>
              </p>
            )}

            {couponSuccess && (
              <p className="text-xs text-emerald-700 font-medium">
                {couponSuccess}
              </p>
            )}
          </div>

          {/* Bill Breakdown Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-dominos space-y-4">
            <h3 className="font-bold text-lg text-slate-900 font-brand">BILL DETAILS</h3>

            <div className="space-y-2.5 text-xs text-slate-600 border-b border-slate-100 pb-4">
              <div className="flex justify-between">
                <span>Item Total (Subtotal)</span>
                <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>- {formatCurrency(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>
                  {deliveryFee === 0 ? (
                    <strong className="text-emerald-600">FREE</strong>
                  ) : (
                    formatCurrency(deliveryFee)
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Taxes & Restaurant Charges (5% GST)</span>
                <span className="font-semibold text-slate-900">{formatCurrency(taxes)}</span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Grand Total</span>
                <span className="text-2xl font-black font-brand text-slate-900">{formatCurrency(grandTotal)}</span>
              </div>
              <div className="text-right text-[11px] text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded-lg">
                Earn 40 Cheesy Pts
              </div>
            </div>

            {/* Proceed to Checkout CTA */}
            <Button
              variant="danger"
              size="lg"
              onClick={() => navigate('/checkout')}
              className="w-full font-brand text-base tracking-wide shadow-dominos-red mt-2"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            {/* Safety Guarantee */}
            <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe & Contactless Delivery Guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

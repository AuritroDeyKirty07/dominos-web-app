import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart.js';
import { useCustomer } from '../hooks/useCustomer.js';
import { useOrders } from '../hooks/useOrders.js';
import { AddressCard } from '../components/address/AddressCard.jsx';
import { AddressModal } from '../components/address/AddressModal.jsx';
import { Button } from '../components/common/Button.jsx';
import { formatCurrency } from '../utils/formatters.js';
import { OrderItemSummary } from '../components/order/OrderItemSummary.jsx';
import {
  MapPin,
  Plus,
  CreditCard,
  Banknote,
  Smartphone,
  ShieldCheck,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  FileText,
  AlertCircle,
  Zap,
} from 'lucide-react';

// ─── Razorpay Key ───────────────────────────────────────────────────────────
const RAZORPAY_KEY = 'rzp_test_Rk2f1YGduwiC3R';

// ─── Payment options ─────────────────────────────────────────────────────────
const paymentOptions = [
  {
    id: 'COD',
    name: 'Cash on Delivery',
    description: 'Pay cash or scan QR when delivery partner arrives at door.',
    icon: Banknote,
    badge: 'Popular',
    razorpay: false,
  },
  {
    id: 'RAZORPAY',
    name: 'Pay Online (Razorpay)',
    description: 'Cards, UPI, Net Banking, Wallets — all in one secure gateway.',
    icon: Zap,
    badge: 'Fastest',
    razorpay: true,
  },
  {
    id: 'UPI',
    name: 'UPI (Google Pay / PhonePe / Paytm)',
    description: 'Instant contactless payment via your favorite UPI app.',
    icon: Smartphone,
    badge: null,
    razorpay: false,
  },
  {
    id: 'CARD',
    name: 'Credit / Debit Card',
    description: 'Visa, MasterCard, RuPay, and American Express accepted.',
    icon: CreditCard,
    badge: null,
    razorpay: false,
  },
];

// ─── Razorpay helper ─────────────────────────────────────────────────────────
/**
 * Opens the Razorpay payment modal.
 * Returns a Promise that resolves with the payment response on success,
 * or rejects with the error object on failure / dismissal.
 */
const openRazorpay = ({ amountInPaise, customerName, customerEmail, customerPhone, orderId }) => {
  return new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      reject(new Error('Razorpay SDK not loaded. Please check your internet connection.'));
      return;
    }

    const options = {
      key: RAZORPAY_KEY,
      amount: String(amountInPaise),   // Amount in paise (subunits)
      currency: 'INR',
      name: "Domino's Pizza",
      description: "Pizza Shop Transaction",
      image: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Dominos_pizza_logo.svg',
      // NOTE: order_id is intentionally omitted here because this is a
      // frontend-only integration (no backend to create a Razorpay order).
      // In production you MUST generate the order_id from your backend.
      handler: function (response) {
        // Payment captured successfully on Razorpay
        resolve(response);
      },
      prefill: {
        name: customerName || 'Customer',
        email: customerEmail || 'customer@example.com',
        contact: customerPhone || '9999999999',
      },
      notes: {
        app_order_id: orderId || '',
        address: 'Dominos Pizza Store',
      },
      theme: {
        color: '#006491', // Domino's blue
      },
      modal: {
        ondismiss: function () {
          reject(new Error('Payment was cancelled by the user.'));
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on('payment.failed', function (response) {
      reject({
        code: response.error.code,
        description: response.error.description,
        source: response.error.source,
        step: response.error.step,
        reason: response.error.reason,
      });
    });

    rzp.open();
  });
};

// ─── Component ───────────────────────────────────────────────────────────────
export const CheckoutPage = () => {
  const {
    cartItems,
    subtotal,
    discount,
    deliveryFee,
    taxes,
    grandTotal,
    appliedCoupon,
    clearCart,
  } = useCart();

  const {
    addresses,
    selectedAddress,
    setSelectedAddress,
    addAddress,
    profile,
  } = useCustomer();

  const { placeOrder } = useOrders();
  const navigate = useNavigate();

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('RAZORPAY');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [redeemPoints, setRedeemPoints] = useState(false);
  const [isPlacing, setIsPlacing] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const pointsDiscount = redeemPoints ? 50 : 0;
  const finalPayable = Math.max(0, grandTotal - pointsDiscount);

  // ── Build the order payload ────────────────────────────────────────────────
  const buildOrderPayload = (razorpayPaymentId = null) => ({
    customerId: profile?.customerId || 'CUST-8839',
    items: cartItems.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      isVeg: item.isVeg,
      price: item.unitPrice,
      quantity: item.quantity,
      customization: item.customization,
      itemTotal: item.unitPrice * item.quantity,
    })),
    deliveryAddress: {
      type: selectedAddress?.type,
      name: selectedAddress?.name,
      phone: selectedAddress?.phone,
      addressLine1: selectedAddress?.addressLine1,
      addressLine2: selectedAddress?.addressLine2,
      landmark: selectedAddress?.landmark,
      city: selectedAddress?.city,
      pinCode: selectedAddress?.pinCode,
    },
    pricing: {
      subtotal,
      discount: discount + pointsDiscount,
      couponCode: appliedCoupon?.code || null,
      deliveryFee,
      tax: taxes,
      grandTotal: finalPayable,
    },
    paymentMethod:
      paymentOptions.find((p) => p.id === selectedPayment)?.name || 'Cash on Delivery',
    paymentDetails: razorpayPaymentId
      ? { razorpayPaymentId, status: 'PAID' }
      : { status: 'PENDING' },
    deliveryInstructions,
  });

  // ── Handle Place Order ─────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    setCheckoutError(null);
    setPaymentSuccess(null);

    if (!selectedAddress) {
      setCheckoutError('Please select or add a delivery address to continue.');
      return;
    }

    const isRazorpaySelected =
      paymentOptions.find((p) => p.id === selectedPayment)?.razorpay === true;

    try {
      setIsPlacing(true);

      if (isRazorpaySelected) {
        // ── Razorpay online payment flow ──────────────────────────────────
        let razorpayResponse;
        try {
          razorpayResponse = await openRazorpay({
            amountInPaise: finalPayable * 100,          // Convert ₹ → paise
            customerName: profile?.name || selectedAddress?.name,
            customerEmail: profile?.email || '',
            customerPhone: selectedAddress?.phone || profile?.phone || '',
            orderId: `DOM-${Date.now()}`,
          });
        } catch (payErr) {
          // Payment failed or was cancelled — do NOT place the order
          setCheckoutError(
            typeof payErr === 'string'
              ? payErr
              : payErr?.description || payErr?.message || 'Payment was not completed.'
          );
          setIsPlacing(false);
          return;
        }

        // Payment succeeded — place the order with payment ID attached
        const createdOrder = await placeOrder(
          buildOrderPayload(razorpayResponse.razorpay_payment_id)
        );
        clearCart();
        navigate(`/order-confirmation/${createdOrder.orderId}`);
      } else {
        // ── COD / UPI / Card (offline) flow ──────────────────────────────
        const createdOrder = await placeOrder(buildOrderPayload());
        clearCart();
        navigate(`/order-confirmation/${createdOrder.orderId}`);
      }
    } catch (err) {
      console.error(err);
      setCheckoutError('Failed to place order. Please try again.');
    } finally {
      setIsPlacing(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="w-full px-[5%] py-8 space-y-8">
      {/* Page Title */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-black font-brand text-slate-900 tracking-wide">
          CHECKOUT & ORDER
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Select delivery location, payment method, and complete your order
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── Left Column ── */}
        <div className="lg:col-span-8 space-y-6">

          {/* 1. Delivery Address */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-dominos-blue text-white flex items-center justify-center font-black font-brand text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 font-brand">DELIVERY ADDRESS</h3>
                  <p className="text-xs text-slate-500">Where should we deliver your hot pizzas?</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddressModalOpen(true)}
                className="text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Add New</span>
              </Button>
            </div>

            {addresses.length === 0 ? (
              <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                <p className="text-xs text-slate-500">No saved addresses found.</p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsAddressModalOpen(true)}
                  className="mt-2"
                >
                  Add Delivery Address
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {addresses.map((addr) => (
                  <AddressCard
                    key={addr.id}
                    address={addr}
                    isSelected={selectedAddress?.id === addr.id}
                    onSelect={setSelectedAddress}
                    selectable={true}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 2. Delivery Instructions */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-dominos-blue text-white flex items-center justify-center font-black font-brand text-sm">
                2
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 font-brand">DELIVERY INSTRUCTIONS</h3>
                <p className="text-xs text-slate-500">Special requests for the delivery partner</p>
              </div>
            </div>
            <div className="pt-2">
              <input
                type="text"
                placeholder="e.g. Leave with security, ring bell twice, call before arriving"
                value={deliveryInstructions}
                onChange={(e) => setDeliveryInstructions(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:border-dominos-blue"
              />
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-dominos-blue text-white flex items-center justify-center font-black font-brand text-sm">
                3
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 font-brand">PAYMENT METHOD</h3>
                <p className="text-xs text-slate-500">Choose how you'd like to pay</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {paymentOptions.map((opt) => {
                const isSelected = selectedPayment === opt.id;
                const IconComponent = opt.icon;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedPayment(opt.id)}
                    className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-dominos-blue bg-dominos-blue/[0.03] ring-2 ring-dominos-blue shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`p-2.5 rounded-xl ${
                          isSelected ? 'bg-dominos-blue text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-900 font-brand">{opt.name}</p>
                          {opt.badge && (
                            <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase">
                              {opt.badge}
                            </span>
                          )}
                          {opt.razorpay && (
                            <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase">
                              Razorpay
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{opt.description}</p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-dominos-blue bg-dominos-blue' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Razorpay trust badge */}
            {selectedPayment === 'RAZORPAY' && (
              <div className="mt-2 flex items-center gap-2 p-3 bg-blue-50 border border-blue-100 rounded-2xl text-xs text-blue-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>
                  Payments are secured by{' '}
                  <strong>Razorpay</strong> — India's most trusted payment gateway. Your card
                  details are never stored on our servers.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column ── */}
        <div className="lg:col-span-4 space-y-6">

          {/* Cheesy Loyalty Points */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-5 rounded-3xl shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span className="font-bold text-sm font-brand tracking-wide">CHEESY REWARDS</span>
              </div>
              <span className="text-xs font-black bg-black/20 px-2.5 py-1 rounded-full">
                {profile?.loyaltyPoints || 420} Pts Available
              </span>
            </div>
            <p className="text-xs text-amber-100">
              Redeem 200 points for an instant ₹50 discount on this order!
            </p>
            <div className="pt-1 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setRedeemPoints(!redeemPoints)}
                className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                  redeemPoints
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'bg-black/20 hover:bg-black/30 text-white'
                }`}
              >
                {redeemPoints ? '✓ 200 Points Applied (-₹50)' : 'Redeem 200 Points'}
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-dominos space-y-4">
            <h3 className="font-bold text-lg text-slate-900 font-brand">ORDER SUMMARY</h3>

            <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1">
              {cartItems.map((item) => (
                <OrderItemSummary key={item.cartItemId} item={item} />
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span>- {formatCurrency(discount)}</span>
                </div>
              )}
              {redeemPoints && (
                <div className="flex justify-between text-amber-600 font-semibold">
                  <span>Points Discount</span>
                  <span>- {formatCurrency(pointsDiscount)}</span>
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
                <span>Taxes & Charges (5% GST)</span>
                <span className="font-semibold text-slate-900">{formatCurrency(taxes)}</span>
              </div>
            </div>

            {/* Total Payable */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Total Payable
                </span>
                <span className="text-2xl font-black font-brand text-slate-900">
                  {formatCurrency(finalPayable)}
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                30 Mins Delivery
              </span>
            </div>

            {/* Error Banner */}
            {checkoutError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-dominos-red flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{checkoutError}</span>
              </div>
            )}

            {/* CTA Button */}
            <Button
              variant="danger"
              size="lg"
              isLoading={isPlacing}
              onClick={handlePlaceOrder}
              className="w-full font-brand text-base tracking-wide shadow-dominos-red"
            >
              {selectedPayment === 'RAZORPAY' ? (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  <span>PAY {formatCurrency(finalPayable)} & ORDER</span>
                </>
              ) : (
                <>
                  <span>PLACE DOMINO'S ORDER</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            {/* Safety note */}
            <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safe & Contactless Delivery Guaranteed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSave={addAddress}
      />
    </div>
  );
};

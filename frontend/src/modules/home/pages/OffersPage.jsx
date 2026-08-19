import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOffers } from '../services/offersService.js';
import { useCart } from '../hooks/useCart.js';
import { Button } from '../components/common/Button.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { formatCurrency } from '../utils/formatters.js';
import {
  Tag,
  Copy,
  Check,
  Sparkles,
  Percent,
  Clock,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

export const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);

  const { applyCoupon, appliedCoupon } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const data = await getOffers();
        setOffers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleApplyOffer = (code) => {
    applyCoupon(code);
    navigate('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-dominos-dark to-dominos-blue text-white rounded-3xl p-6 sm:p-10 shadow-dominos">
        <div className="flex items-center gap-2 text-amber-300 text-xs font-black uppercase tracking-widest">
          <Sparkles className="w-4 h-4" />
          <span>Save Big On Every Bite</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-brand mt-1 text-white tracking-wide">
          DOMINO'S COUPONS & EXCLUSIVE DEALS
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl">
          Apply discount codes at checkout to unlock instant discounts, free crust upgrades, and combo bonuses.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer) => {
            const isApplied = appliedCoupon?.code === offer.code;
            const isCopied = copiedCode === offer.code;

            return (
              <div
                key={offer.code}
                className={`bg-white rounded-3xl border p-6 flex flex-col justify-between transition-all duration-200 ${
                  isApplied
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-dominos'
                    : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-black bg-dominos-red text-white px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {offer.badge}
                    </span>
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{offer.expiry}</span>
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 font-brand mt-4">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {offer.description}
                  </p>

                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 space-y-1">
                    <p>• Minimum order amount: <strong>{formatCurrency(offer.minOrderValue)}</strong></p>
                    <p>• Maximum savings: <strong>{formatCurrency(offer.maxDiscount)}</strong></p>
                  </div>
                </div>

                {/* Coupon Code Action Strip */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="px-4 py-2 bg-slate-100 border border-dashed border-slate-400 rounded-xl font-black text-sm text-slate-800 tracking-wider flex items-center justify-between gap-3 flex-1 sm:flex-initial">
                      <span>{offer.code}</span>
                      <button
                        onClick={() => handleCopyCode(offer.code)}
                        className="text-slate-400 hover:text-slate-700"
                        title="Copy code"
                      >
                        {isCopied ? <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    variant={isApplied ? 'success' : 'danger'}
                    size="md"
                    onClick={() => handleApplyOffer(offer.code)}
                    className="w-full sm:w-auto text-xs font-bold font-brand tracking-wider"
                  >
                    {isApplied ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>COUPON APPLIED</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <span>APPLY CODE</span>
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

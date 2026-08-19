import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getMenuItemById, getMenuItems } from '../services/menuService.js';
import { useCart } from '../services/useCart.js';
import { VegBadge } from '../components/common/VegBadge.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { ProductCard } from '../components/menu/ProductCard.jsx';
import { formatCurrency } from '../services/formatters.js';
import {
  Star,
  Pizza,
  Check,
  Plus,
  Minus,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Flame,
} from 'lucide-react';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, calculateItemUnitPrice } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Customization State
  const [selectedSize, setSelectedSize] = useState('Medium');
  const [selectedCrust, setSelectedCrust] = useState('New Hand Tossed');
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [addedNotification, setAddedNotification] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const item = await getMenuItemById(id);
        setProduct(item);
        if (item) {
          setSelectedSize(item.customizationOptions?.sizes?.[1]?.name || item.customizationOptions?.sizes?.[0]?.name || 'Medium');
          setSelectedCrust(item.customizationOptions?.crusts?.[0]?.name || 'New Hand Tossed');
          setSelectedToppings([]);
          setSelectedAddOns([]);
          setQuantity(1);

          // Get related items
          const allItems = await getMenuItems({ category: item.category });
          setRelatedItems(allItems.filter(i => i.id !== item.id).slice(0, 3));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold font-brand">Product Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">The pizza you're looking for doesn't exist.</p>
        <Button variant="primary" onClick={() => navigate('/menu')} className="mt-4">
          Back to Menu
        </Button>
      </div>
    );
  }

  const options = product.customizationOptions || {};
  const sizes = options.sizes || [];
  const crusts = options.crusts || [];
  const toppings = options.toppings || [];
  const addOns = options.addOns || [];

  const currentCustomization = product.isCustomizable ? {
    size: selectedSize,
    crust: selectedCrust,
    toppings: selectedToppings,
    addOns: selectedAddOns,
  } : null;

  const unitPrice = calculateItemUnitPrice(product, currentCustomization);
  const grandItemTotal = unitPrice * quantity;

  const toggleTopping = (toppingName) => {
    setSelectedToppings(prev =>
      prev.includes(toppingName)
        ? prev.filter(t => t !== toppingName)
        : [...prev, toppingName]
    );
  };

  const toggleAddOn = (addonName) => {
    setSelectedAddOns(prev =>
      prev.includes(addonName)
        ? prev.filter(a => a !== addonName)
        : [...prev, addonName]
    );
  };

  const handleAddToCart = () => {
    addToCart(product, currentCustomization, quantity);
    setAddedNotification(true);
    setTimeout(() => setAddedNotification(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back link */}
      <div>
        <Link
          to="/menu"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-dominos-blue transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Domino's Menu</span>
        </Link>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Visual & Trust */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative aspect-square rounded-3xl overflow-hidden shadow-dominos border border-slate-200 bg-slate-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <VegBadge isVeg={product.isVeg} size="lg" />
              {product.badge && (
                <Badge variant="brand" size="md">{product.badge}</Badge>
              )}
            </div>

            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 font-bold text-xs text-slate-800">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviewsCount} reviews)</span>
            </div>
          </div>

          {/* Quality highlights */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Domino's Quality Guarantee
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Real Mozzarella</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-dominos-red" />
                <span>Baked Fresh at 245°C</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Description & Customization */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-dominos-blue uppercase tracking-wider">
                {product.category?.replace('-', ' ')}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-brand text-slate-900 mt-1">
              {product.name}
            </h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Customization Options */}
          {product.isCustomizable && (
            <div className="space-y-6 pt-4 border-t border-slate-200">
              {/* Size */}
              {sizes.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      1. Choose Size
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Single selection</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {sizes.map((s) => {
                      const isSelected = selectedSize === s.name;
                      return (
                        <button
                          key={s.name}
                          type="button"
                          onClick={() => setSelectedSize(s.name)}
                          className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-between ${
                            isSelected
                              ? 'border-dominos-blue bg-dominos-blue/5 ring-2 ring-dominos-blue shadow-sm'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <Pizza className={`mb-1.5 ${s.name === 'Large' ? 'w-6 h-6' : s.name === 'Medium' ? 'w-5 h-5' : 'w-4 h-4'} ${isSelected ? 'text-dominos-blue' : 'text-slate-500'}`} />
                          <span className="font-bold text-sm text-slate-900">{s.name}</span>
                          <span className="text-[11px] text-slate-500">{s.serves}</span>
                          <span className="text-xs font-black text-dominos-blue mt-1">
                            {formatCurrency(s.basePrice || product.price)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Crust */}
              {crusts.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      2. Choose Crust
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {crusts.map((c) => {
                      const isSelected = selectedCrust === c.name;
                      return (
                        <div
                          key={c.name}
                          onClick={() => setSelectedCrust(c.name)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'border-dominos-blue bg-dominos-blue/5 ring-1 ring-dominos-blue'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-800">{c.name}</p>
                            <p className="text-[10px] text-slate-500">{c.description}</p>
                          </div>
                          <span className="text-xs font-bold text-slate-700 flex-shrink-0 ml-2">
                            {c.extraPrice > 0 ? `+${formatCurrency(c.extraPrice)}` : 'Free'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Extra Toppings */}
              {toppings.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    3. Add Extra Toppings (Optional)
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {toppings.map((t) => {
                      const isSelected = selectedToppings.includes(t.name);
                      return (
                        <div
                          key={t.name}
                          onClick={() => toggleTopping(t.name)}
                          className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                            isSelected
                              ? 'border-dominos-blue bg-dominos-blue/5'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <VegBadge isVeg={t.isVeg} size="sm" />
                            <span className="text-xs font-medium text-slate-800 truncate">{t.name}</span>
                          </div>
                          <span className="text-[11px] font-bold text-slate-500 ml-1">+{formatCurrency(t.price)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add Ons */}
              {addOns.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    4. Dips & Seasonings
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {addOns.map((a) => {
                      const isSelected = selectedAddOns.includes(a.name);
                      return (
                        <div
                          key={a.name}
                          onClick={() => toggleAddOn(a.name)}
                          className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                            isSelected
                              ? 'border-dominos-blue bg-dominos-blue/5'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <span className="text-xs font-medium text-slate-800">{a.name}</span>
                          <span className="text-[11px] font-bold text-slate-500">+{formatCurrency(a.price)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sticky Price & Add to Cart Container */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Price</span>
                <span className="text-2xl font-black font-brand text-white">
                  {formatCurrency(grandItemTotal)}
                </span>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center border border-slate-700 rounded-xl p-1 bg-slate-800">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors disabled:opacity-40"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <Button
              variant="danger"
              size="lg"
              onClick={handleAddToCart}
              className="w-full sm:w-auto min-w-[200px] font-brand tracking-wide text-base shadow-dominos-red"
            >
              {addedNotification ? (
                <span className="flex items-center gap-2">
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>Added to Cart!</span>
                </span>
              ) : (
                <span>ADD TO CART • {formatCurrency(grandItemTotal)}</span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Related Products Strip */}
      {relatedItems.length > 0 && (
        <div className="pt-8 border-t border-slate-200 space-y-4">
          <h3 className="text-2xl font-black font-brand text-slate-900">
            YOU MIGHT ALSO LOVE
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedItems.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


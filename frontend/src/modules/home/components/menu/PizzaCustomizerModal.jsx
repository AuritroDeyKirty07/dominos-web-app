import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal.jsx';
import { Button } from '../common/Button.jsx';
import { VegBadge } from '../common/VegBadge.jsx';
import { formatCurrency } from '../../utils/formatters.js';
import { useCart } from '../../hooks/useCart.js';
import { Plus, Minus, Check, Sparkles, Pizza, ChevronRight } from 'lucide-react';

export const PizzaCustomizerModal = ({ isOpen, onClose, product }) => {
  const { addToCart, calculateItemUnitPrice } = useCart();

  const [selectedSize, setSelectedSize] = useState('Medium');
  const [selectedCrust, setSelectedCrust] = useState('New Hand Tossed');
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [showAddedSuccess, setShowAddedSuccess] = useState(false);

  // Initialize defaults on product change
  useEffect(() => {
    if (product) {
      setSelectedSize(product.customizationOptions?.sizes?.[1]?.name || product.customizationOptions?.sizes?.[0]?.name || 'Medium');
      setSelectedCrust(product.customizationOptions?.crusts?.[0]?.name || 'New Hand Tossed');
      setSelectedToppings([]);
      setSelectedAddOns([]);
      setQuantity(1);
      setShowAddedSuccess(false);
    }
  }, [product]);

  if (!product) return null;

  const options = product.customizationOptions || {};
  const sizes = options.sizes || [];
  const crusts = options.crusts || [];
  const toppings = options.toppings || [];
  const addOns = options.addOns || [];

  const currentCustomization = {
    size: selectedSize,
    crust: selectedCrust,
    toppings: selectedToppings,
    addOns: selectedAddOns,
  };

  const unitPrice = calculateItemUnitPrice(product, currentCustomization);
  const totalPrice = unitPrice * quantity;

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
    setShowAddedSuccess(true);
    setTimeout(() => {
      setShowAddedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Customize Your Pizza"
      subtitle={product.name}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Product Banner Info */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-sm flex-shrink-0 bg-slate-200">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-1.5 left-1.5">
              <VegBadge isVeg={product.isVeg} size="sm" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-base text-slate-900 truncate font-brand">{product.name}</h4>
            <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{product.description}</p>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-600 font-semibold">
              <span>Base: {formatCurrency(product.price)}</span>
              <span>•</span>
              <span className="text-dominos-blue font-bold">Live Unit Price: {formatCurrency(unitPrice)}</span>
            </div>
          </div>
        </div>

        {/* Step 1: Select Size */}
        {sizes.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                1. Select Size <span className="text-dominos-red">*</span>
              </h4>
              <span className="text-[11px] font-medium text-slate-500">Choice of 1</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {sizes.map((s) => {
                const isSelected = selectedSize === s.name;
                return (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => setSelectedSize(s.name)}
                    className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-between ${
                      isSelected
                        ? 'border-dominos-blue bg-dominos-blue/5 ring-2 ring-dominos-blue shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`p-2 rounded-full mb-1 ${isSelected ? 'bg-dominos-blue text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Pizza className={`${s.name === 'Large' ? 'w-6 h-6' : s.name === 'Medium' ? 'w-5 h-5' : 'w-4 h-4'}`} />
                    </div>
                    <span className="font-bold text-xs text-slate-900">{s.name}</span>
                    <span className="text-[10px] text-slate-500">{s.serves}</span>
                    <span className="text-xs font-extrabold text-dominos-blue mt-1">
                      {formatCurrency(s.basePrice || product.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Select Crust */}
        {crusts.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Select Crust <span className="text-dominos-red">*</span>
              </h4>
              <span className="text-[11px] font-medium text-slate-500">Choice of 1</span>
            </div>

            <div className="space-y-2">
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
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-dominos-blue bg-dominos-blue' : 'border-slate-300'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{c.name}</p>
                        <p className="text-[11px] text-slate-500">{c.description}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-700">
                      {c.extraPrice > 0 ? `+${formatCurrency(c.extraPrice)}` : 'Included'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Extra Toppings */}
        {toppings.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                3. Add Extra Toppings (Optional)
              </h4>
              <span className="text-[11px] font-medium text-slate-500">{selectedToppings.length} selected</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {toppings.map((t) => {
                const isSelected = selectedToppings.includes(t.name);
                return (
                  <div
                    key={t.name}
                    onClick={() => toggleTopping(t.name)}
                    className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-dominos-blue bg-dominos-blue/5 text-dominos-blue'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <VegBadge isVeg={t.isVeg} size="sm" />
                      <span className="text-xs font-medium text-slate-800">{t.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-600">+{formatCurrency(t.price)}</span>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isSelected ? 'bg-dominos-blue border-dominos-blue text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Add-on Dips / Seasonings */}
        {addOns.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                4. Dips & Seasonings (Optional)
              </h4>
            </div>

            <div className="space-y-2">
              {addOns.map((a) => {
                const isSelected = selectedAddOns.includes(a.name);
                return (
                  <div
                    key={a.name}
                    onClick={() => toggleAddOn(a.name)}
                    className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-dominos-blue bg-dominos-blue/5 text-dominos-blue'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-xs font-medium text-slate-800">{a.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-600">+{formatCurrency(a.price)}</span>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isSelected ? 'bg-dominos-blue border-dominos-blue text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sticky Action Footer */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quantity:</span>
            <div className="flex items-center border border-slate-300 rounded-lg p-1 bg-slate-50">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 flex items-center justify-center rounded bg-white text-slate-700 hover:bg-slate-200 transition-colors shadow-sm disabled:opacity-40"
                disabled={quantity <= 1}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-9 text-center text-sm font-bold text-slate-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 flex items-center justify-center rounded bg-white text-slate-700 hover:bg-slate-200 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <Button
            variant="danger"
            size="lg"
            onClick={handleAddToCart}
            className="w-full sm:w-auto min-w-[220px]"
          >
            {showAddedSuccess ? (
              <span className="flex items-center gap-1.5">
                <Check className="w-5 h-5 stroke-[3]" />
                <span>Added to Cart!</span>
              </span>
            ) : (
              <span className="flex items-center justify-between w-full gap-4">
                <span>Add To Cart</span>
                <span className="font-black bg-white/20 px-2 py-0.5 rounded text-sm">
                  {formatCurrency(totalPrice)}
                </span>
              </span>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

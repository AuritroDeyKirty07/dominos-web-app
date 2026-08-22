import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { VegBadge } from '../common/VegBadge.jsx';
import { Badge } from '../common/Badge.jsx';
import { Button } from '../common/Button.jsx';
import { formatCurrency } from '../../utils/formatters.js';
import { useCart } from '../../hooks/useCart.js';
import { PizzaCustomizerModal } from './PizzaCustomizerModal.jsx';
import { Star, Plus, SlidersHorizontal, Check } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [showAddedQuick, setShowAddedQuick] = useState(false);
  const { addToCart } = useCart();

  const isCustomizable = product.isCustomizable && product.customizationOptions;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isCustomizable) {
      setIsCustomizeOpen(true);
    } else {
      addToCart(product, null, 1);
      setShowAddedQuick(true);
      setTimeout(() => setShowAddedQuick(false), 800);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-dominos hover:border-slate-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
        {/* Card Header & Media */}
        <div className="relative">
          <Link to={`/product/${product.id}`} className="block relative aspect-[16/10] overflow-hidden bg-slate-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <VegBadge isVeg={product.isVeg} size="md" />
              {product.badge && (
                <Badge variant="brand" size="sm">
                  {product.badge}
                </Badge>
              )}
            </div>

            {/* Rating pill */}
            <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-sm text-slate-800 text-xs font-extrabold px-2 py-1 rounded-lg shadow-sm flex items-center gap-1 border border-slate-100">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-[10px] text-slate-400 font-normal">({product.reviewsCount})</span>
            </div>
          </Link>
        </div>

        {/* Card Body */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <Link to={`/product/${product.id}`}>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-dominos-blue transition-colors font-brand line-clamp-1">
                {product.name}
              </h3>
            </Link>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price & Action Row */}
          <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">Price</span>
              <span className="text-base font-black text-slate-900">
                {formatCurrency(product.price)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Button
                variant="danger"
                size="sm"
                onClick={handleQuickAdd}
                className="px-4 py-1.5 text-xs font-bold shadow-sm whitespace-nowrap min-w-[70px]"
              >
                {showAddedQuick && !isCustomizable ? (
                  <Check className="w-4 h-4 stroke-[3] flex-shrink-0" />
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 stroke-[3] flex-shrink-0" />
                    <span>ADD</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Customizer Modal */}
      {isCustomizable && (
        <PizzaCustomizerModal
          isOpen={isCustomizeOpen}
          onClose={() => setIsCustomizeOpen(false)}
          product={product}
        />
      )}
    </>
  );
};

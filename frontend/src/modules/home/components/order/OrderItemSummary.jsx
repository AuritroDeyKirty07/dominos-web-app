import React from 'react';
import { VegBadge } from '../common/VegBadge.jsx';
import { formatCurrency } from '../../services/formatters.js';

export const OrderItemSummary = ({ item }) => {
  const custom = item.customization;

  return (
    <div className="flex items-start justify-between py-3 border-b border-slate-100 last:border-0 gap-4">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <VegBadge isVeg={item.isVeg} size="sm" />
        <div className="flex-1 min-w-0">
          <h5 className="font-bold text-sm text-slate-800 truncate font-brand">{item.name}</h5>

          {custom && (
            <div className="text-xs text-slate-500 mt-0.5 space-y-0.5">
              <p className="font-medium text-slate-700">
                {custom.size} • {custom.crust}
              </p>
              {custom.toppings && custom.toppings.length > 0 && (
                <p className="text-slate-500">
                  <span className="text-slate-400">Toppings:</span> {custom.toppings.join(', ')}
                </p>
              )}
              {custom.addOns && custom.addOns.length > 0 && (
                <p className="text-slate-500">
                  <span className="text-slate-400">Add-ons:</span> {custom.addOns.join(', ')}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 mt-1 text-xs text-slate-600 font-semibold">
            <span>Qty: {item.quantity}</span>
            <span>×</span>
            <span>{formatCurrency(item.unitPrice || item.price)}</span>
          </div>
        </div>
      </div>

      <span className="font-black text-sm text-slate-900 flex-shrink-0">
        {formatCurrency((item.unitPrice || item.price) * item.quantity)}
      </span>
    </div>
  );
};


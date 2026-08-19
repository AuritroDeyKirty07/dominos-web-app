import React from 'react';
import { MapPin, CheckCircle, Trash2, Home, Briefcase, Bookmark, Phone, User } from 'lucide-react';
import { Button } from '../common/Button.jsx';
import { Badge } from '../common/Badge.jsx';

export const AddressCard = ({
  address,
  isSelected = false,
  onSelect,
  onDelete,
  onSetDefault,
  selectable = true,
}) => {
  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'home':
        return <Home className="w-4 h-4" />;
      case 'work':
        return <Briefcase className="w-4 h-4" />;
      default:
        return <Bookmark className="w-4 h-4" />;
    }
  };

  return (
    <div
      onClick={selectable && onSelect ? () => onSelect(address) : undefined}
      className={`relative p-5 rounded-2xl border transition-all duration-200 bg-white ${
        selectable ? 'cursor-pointer' : ''
      } ${
        isSelected
          ? 'border-dominos-blue ring-2 ring-dominos-blue/20 shadow-dominos bg-dominos-blue/[0.02]'
          : 'border-slate-200 hover:border-slate-300 shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl flex-shrink-0 ${
            isSelected ? 'bg-dominos-blue text-white' : 'bg-slate-100 text-slate-700'
          }`}>
            {getIcon(address.type)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 font-brand">{address.type}</span>
              {address.isDefault && (
                <Badge variant="primary" size="sm">Default</Badge>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
              <User className="w-3 h-3 text-slate-400" />
              <span>{address.name}</span>
            </p>
          </div>
        </div>

        {selectable && isSelected && (
          <CheckCircle className="w-5 h-5 text-dominos-blue flex-shrink-0" />
        )}
      </div>

      {/* Address Details */}
      <div className="mt-3.5 space-y-1 text-xs text-slate-600 pl-1">
        <p className="font-medium text-slate-800">{address.addressLine1}</p>
        {address.addressLine2 && <p>{address.addressLine2}</p>}
        {address.landmark && <p className="text-slate-400">Landmark: {address.landmark}</p>}
        <p className="font-semibold text-slate-700">{address.city}, {address.state || ''} - {address.pinCode}</p>
        <p className="text-slate-500 pt-1 flex items-center gap-1.5">
          <Phone className="w-3 h-3 text-slate-400" />
          <span>Phone: {address.phone}</span>
        </p>
      </div>

      {/* Action Strip */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        {!address.isDefault && onSetDefault && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSetDefault(address.id);
            }}
            className="text-[11px] font-semibold text-dominos-blue hover:underline"
          >
            Set as Default
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(address.id);
            }}
            className="text-[11px] font-semibold text-slate-400 hover:text-dominos-red transition-colors flex items-center gap-1 ml-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
        )}
      </div>
    </div>
  );
};

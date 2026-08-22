import React from 'react';
import { Modal } from '../common/Modal.jsx';
import { useCustomer } from '../../hooks/useCustomer.js';
import { MapPin, Bike, Store, CheckCircle, Plus } from 'lucide-react';
import { Button } from '../common/Button.jsx';
import { useNavigate } from 'react-router-dom';

export const LocationSelectorModal = ({ isOpen, onClose }) => {
  const {
    deliveryMode,
    setDeliveryMode,
    addresses,
    selectedAddress,
    setSelectedAddress
  } = useCustomer();

  const navigate = useNavigate();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Order Type & Location"
      subtitle="Fresh & hot pizzas delivered in 30 mins or ready for takeout"
      maxWidth="max-w-lg"
    >
      <div className="space-y-6">
        {/* Delivery / Takeaway Tabs */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-xl">
          <button
            onClick={() => setDeliveryMode('delivery')}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all ${
              deliveryMode === 'delivery'
                ? 'bg-dominos-blue text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bike className="w-4 h-4" />
            <span>Delivery (30 Mins)</span>
          </button>
          <button
            onClick={() => setDeliveryMode('takeaway')}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all ${
              deliveryMode === 'takeaway'
                ? 'bg-dominos-blue text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Takeaway (15 Mins)</span>
          </button>
        </div>

        {deliveryMode === 'delivery' ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Saved Delivery Addresses
              </span>
              <button
                onClick={() => {
                  onClose();
                  navigate('/addresses');
                }}
                className="text-xs font-semibold text-dominos-blue hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Manage Addresses</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {addresses.map((addr) => {
                const isSelected = selectedAddress?.id === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => {
                      setSelectedAddress(addr);
                      onClose();
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'border-dominos-blue bg-dominos-blue/5 ring-1 ring-dominos-blue'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-dominos-blue text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">{addr.type}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">Default</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 truncate mt-0.5">{addr.addressLine1}, {addr.city}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{addr.name} • {addr.phone}</p>
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-5 h-5 text-dominos-blue flex-shrink-0 mt-1" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center gap-2 text-dominos-blue font-bold text-sm">
              <Store className="w-5 h-5" />
              <span>Selected Domino's Store for Pickup</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Domino's Pizza - 100 Ft Road, Indiranagar</p>
              <p className="text-xs text-slate-500 mt-0.5">Plot No 482, 100 Feet Rd, Indiranagar, Bengaluru - 560038</p>
              <p className="text-xs text-emerald-600 font-medium mt-1.5">Open Now • Ready in 15 mins</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              className="w-full mt-2"
              onClick={onClose}
            >
              Confirm Store for Pickup
            </Button>
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <Button variant="secondary" onClick={onClose} size="sm">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

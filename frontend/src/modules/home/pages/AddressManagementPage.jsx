import React, { useState } from 'react';
import { useCustomer } from '../hooks/useCustomer.js';
import { AddressCard } from '../components/address/AddressCard.jsx';
import { AddressModal } from '../components/address/AddressModal.jsx';
import { Button } from '../components/common/Button.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import {
  MapPin,
  Plus,
  User,
  Mail,
  Phone,
  Award,
  Sparkles,
} from 'lucide-react';

export const AddressManagementPage = () => {
  const {
    profile,
    addresses,
    selectedAddress,
    setSelectedAddress,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    isLoading,
  } = useCustomer();

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center p-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full px-[5%] py-8 space-y-8">
      {/* Profile Overview Card */}
      <div className="bg-gradient-to-r from-dominos-blue to-dominos-dark text-white rounded-3xl p-6 sm:p-8 shadow-dominos flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md text-white flex items-center justify-center font-black text-2xl font-brand border border-white/20">
            {profile?.name ? profile.name.charAt(0) : 'A'}
          </div>
          <div>
            <span className="text-xs font-black uppercase text-amber-300 tracking-wider">
              Domino's Gold Member
            </span>
            <h1 className="text-2xl font-black font-brand text-white mt-0.5">
              {profile?.name || 'Alex Morgan'}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                <span>{profile?.email}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                <span>{profile?.phone}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Loyalty Points Pill */}
        <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3 rounded-2xl flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-400 text-slate-950 font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-amber-300">Cheesy Points</p>
            <p className="text-xl font-black text-white font-brand">{profile?.loyaltyPoints || 420} Pts</p>
          </div>
        </div>
      </div>

      {/* Address Management Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black font-brand text-slate-900">
              SAVED DELIVERY ADDRESSES
            </h2>
            <p className="text-xs text-slate-500">Manage your home, office, and preferred delivery destinations</p>
          </div>

          <Button
            variant="danger"
            size="md"
            onClick={() => setIsModalOpen(true)}
            className="font-bold text-xs shadow-dominos-red"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            <span>ADD NEW ADDRESS</span>
          </Button>
        </div>

        {addresses.length === 0 ? (
          <EmptyState
            icon={MapPin}
            title="No Saved Addresses"
            description="Add your delivery address so we can bring your pizzas to your door in 30 minutes."
            actionText="Add Address"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {addresses.map((addr) => (
              <AddressCard
                key={addr.id}
                address={addr}
                isSelected={selectedAddress?.id === addr.id}
                onSelect={setSelectedAddress}
                onDelete={deleteAddress}
                onSetDefault={setDefaultAddress}
                selectable={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Address Modal */}
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={addAddress}
      />
    </div>
  );
};

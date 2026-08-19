import React, { createContext, useState, useEffect } from 'react';
import * as customerService from '../services/customerService.js';
import { useAuthStore } from '../../../shared/store/authStore.js';

export const CustomerContext = createContext(null);

export const CustomerProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [deliveryMode, setDeliveryMode] = useState('delivery'); // 'delivery' or 'takeaway'
  const [isLoading, setIsLoading] = useState(true);

  const fetchCustomerData = async () => {
    if (!isAuthenticated || !user) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const userProfile = await customerService.getProfile();
      setProfile(userProfile);
      const userAddresses = userProfile.addresses || [];
      setAddresses(userAddresses);

      const defaultAddr = userAddresses.find(a => a.isDefault) || userAddresses[0] || null;
      setSelectedAddress(defaultAddr);
    } catch (err) {
      console.error('Failed to load customer profile from order module:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, [isAuthenticated, user]);

  const handleAddAddress = async (newAddress) => {
    const updatedAddresses = await customerService.addAddress(newAddress);
    setAddresses(updatedAddresses);
    if (newAddress.isDefault || !selectedAddress) {
      const added = updatedAddresses[updatedAddresses.length - 1];
      setSelectedAddress(added);
    }
    return updatedAddresses;
  };

  const handleDeleteAddress = async (addressId) => {
    const updated = await customerService.deleteAddress(addressId);
    setAddresses(updated);
    if (selectedAddress?.id === addressId) {
      setSelectedAddress(updated[0] || null);
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    const updated = await customerService.setDefaultAddress(addressId);
    setAddresses(updated);
    const def = updated.find(a => a.id === addressId);
    if (def) setSelectedAddress(def);
  };

  const updatePreferences = async (newPrefs) => {
    if (!profile) return;
    const updatedProfile = await customerService.updateProfile({
      preferences: { ...profile.preferences, ...newPrefs },
    });
    setProfile(updatedProfile);
  };

  return (
    <CustomerContext.Provider
      value={{
        profile,
        addresses,
        selectedAddress,
        setSelectedAddress,
        deliveryMode,
        setDeliveryMode,
        isLoading,
        addAddress: handleAddAddress,
        deleteAddress: handleDeleteAddress,
        setDefaultAddress: handleSetDefaultAddress,
        updatePreferences,
        refreshCustomer: fetchCustomerData,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

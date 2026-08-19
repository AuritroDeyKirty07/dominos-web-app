import React, { useState } from 'react';
import { Modal } from '../common/Modal.jsx';
import { Input } from '../common/Input.jsx';
import { Button } from '../common/Button.jsx';
import { validatePhone, validatePinCode } from '../../utils/validators.js';
import { Home, Briefcase, Bookmark, MapPin } from 'lucide-react';

export const AddressModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    type: 'Home',
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pinCode: '',
    isDefault: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Contact name is required';
    if (!formData.phone.trim() || !validatePhone(formData.phone)) {
      errs.phone = 'Valid 10-digit mobile number required';
    }
    if (!formData.addressLine1.trim()) errs.addressLine1 = 'House / Flat / Building is required';
    if (!formData.addressLine2.trim()) errs.addressLine2 = 'Street / Area / Locality is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.pinCode.trim() || !validatePinCode(formData.pinCode)) {
      errs.pinCode = 'Valid 6-digit PIN code required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await onSave(formData);
      onClose();
      // Reset
      setFormData({
        type: 'Home',
        name: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        landmark: '',
        city: 'Bengaluru',
        state: 'Karnataka',
        pinCode: '',
        isDefault: false,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addressTypes = [
    { type: 'Home', icon: Home },
    { type: 'Work', icon: Briefcase },
    { type: 'Other', icon: Bookmark },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Delivery Address"
      subtitle="Enter accurate address for superfast 30-minute delivery"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Address Type Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block mb-2">
            Address Label
          </label>
          <div className="grid grid-cols-3 gap-2">
            {addressTypes.map(({ type, icon: IconComponent }) => {
              const isSelected = formData.type === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleChange('type', type)}
                  className={`py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    isSelected
                      ? 'border-dominos-blue bg-dominos-blue text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{type}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Name & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Full Name"
            placeholder="e.g. Alex Morgan"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            required
          />
          <Input
            label="Phone Number"
            placeholder="10-digit mobile number"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            error={errors.phone}
            required
            type="tel"
          />
        </div>

        {/* Address Line 1 */}
        <Input
          label="House / Flat / Floor / Building"
          placeholder="e.g. Flat 402, Royal Palms Heights"
          value={formData.addressLine1}
          onChange={(e) => handleChange('addressLine1', e.target.value)}
          error={errors.addressLine1}
          required
        />

        {/* Address Line 2 */}
        <Input
          label="Street / Locality / Sector"
          placeholder="e.g. 14th Cross, Indiranagar 2nd Stage"
          value={formData.addressLine2}
          onChange={(e) => handleChange('addressLine2', e.target.value)}
          error={errors.addressLine2}
          required
        />

        {/* Landmark */}
        <Input
          label="Nearby Landmark (Optional)"
          placeholder="e.g. Near 100 Feet Road Metro Station"
          value={formData.landmark}
          onChange={(e) => handleChange('landmark', e.target.value)}
        />

        {/* City & PIN Code */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="City"
            placeholder="Bengaluru"
            value={formData.city}
            onChange={(e) => handleChange('city', e.target.value)}
            error={errors.city}
            required
          />
          <Input
            label="PIN Code"
            placeholder="e.g. 560038"
            value={formData.pinCode}
            onChange={(e) => handleChange('pinCode', e.target.value)}
            error={errors.pinCode}
            required
          />
        </div>

        {/* Set as Default Checkbox */}
        <div className="pt-1 flex items-center gap-2">
          <input
            type="checkbox"
            id="isDefault"
            checked={formData.isDefault}
            onChange={(e) => handleChange('isDefault', e.target.checked)}
            className="w-4 h-4 text-dominos-blue rounded border-slate-300 focus:ring-dominos-blue cursor-pointer"
          />
          <label htmlFor="isDefault" className="text-xs font-semibold text-slate-700 cursor-pointer">
            Make this my default delivery address
          </label>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose} size="md">
            Cancel
          </Button>
          <Button variant="primary" type="submit" size="md" isLoading={isSubmitting}>
            Save Address
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// src/pages/Menu/Menu.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiPackage,
  FiDollarSign,
  FiToggleLeft,
  FiToggleRight,
  FiImage,
} from 'react-icons/fi';
import { GiFullPizza } from 'react-icons/gi';
import { fetchAllMenuItems, addMenuItem, editMenuItem, removeMenuItem } from '../../controllers/menuController';
import { TableSkeleton } from '../../components/loaders/SkeletonLoader';

// ─── Admin secret — must match ADMIN_SECRET in backend/.env ──────────────────
// In dev, this is bootstrapped automatically in localStorage.
const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET || 'dominos-admin-secret-key';

const EMPTY_FORM = {
  name: '',
  category: 'veg-pizza',
  description: '',
  image: '',
  price: '',
  costPrice: '',
  isVeg: true,
  sizes: { S: '', M: '', L: '' },
};

// ─── Toast Component ──────────────────────────────────────────────────────────
function Toast({ toast, onClose }) {
  if (!toast) return null;
  const isError = toast.type === 'error';
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold animate-fade-in ${
        isError
          ? 'bg-red-500/10 border border-red-500/20 text-red-500'
          : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
      }`}
    >
      {isError ? <FiAlertCircle className="text-lg flex-shrink-0" /> : <FiCheckCircle className="text-lg flex-shrink-0" />}
      {toast.message}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <FiX />
      </button>
    </div>
  );
}

// ─── Pizza Form Modal ─────────────────────────────────────────────────────────
function MenuFormModal({ isOpen, onClose, onSaved, editItem }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setError('');
      if (editItem) {
        setForm({
          name: editItem.name || '',
          category: editItem.category || 'veg-pizza',
          description: editItem.description || '',
          image: editItem.image || '',
          price: String(editItem.price || editItem.sizes?.S || ''),
          costPrice: String(editItem.costPrice || Math.round((editItem.price || 199) * 0.45)),
          isVeg: editItem.isVeg !== false,
          sizes: {
            S: String(editItem.sizes?.S || editItem.price || ''),
            M: String(editItem.sizes?.M || ''),
            L: String(editItem.sizes?.L || ''),
          },
        });
      } else {
        setForm(EMPTY_FORM);
      }
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [isOpen, editItem]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm((f) => ({ ...f, [name]: checked }));
    } else if (name === 'S' || name === 'M' || name === 'L') {
      setForm((f) => ({ ...f, sizes: { ...f.sizes, [name]: value } }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) return setError('Item name is required.');
    const priceNum = Number(form.price) || Number(form.sizes.S);
    if (!priceNum || priceNum <= 0) return setError('Selling price is required and must be greater than 0.');
    
    const costNum = Number(form.costPrice) || Math.round(priceNum * 0.45);

    // Ensure the admin token is in localStorage so api.js sends it
    localStorage.setItem('authToken', ADMIN_SECRET);

    try {
      setSaving(true);
      const sNum = Number(form.sizes.S) || priceNum;
      const mNum = Number(form.sizes.M) || Math.round(priceNum * 1.8);
      const lNum = Number(form.sizes.L) || Math.round(priceNum * 2.6);

      const payload = {
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim(),
        image: form.image.trim(),
        price: priceNum,
        costPrice: costNum,
        isVeg: form.isVeg,
        sizes: { S: sNum, M: mNum, L: lNum },
      };

      let saved;
      if (editItem) {
        saved = await editMenuItem(editItem.id, payload);
      } else {
        saved = await addMenuItem(payload);
      }
      onSaved(saved, !!editItem);
      onClose();
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl">
              <GiFullPizza />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-800 dark:text-white">
                {editItem ? 'Edit Menu Item' : 'Add New Item'}
              </h2>
              <p className="text-xs text-gray-400">Configures pricing, cost of goods, and catalog data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
              <FiAlertCircle className="flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                Item Name *
              </label>
              <input
                ref={firstInputRef}
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Margherita Classic"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="veg-pizza">Veg Pizzas</option>
                <option value="non-veg-pizza">Non-Veg Pizzas</option>
                <option value="pizza-mania">Pizza Mania</option>
                <option value="sides">Sides & Dips</option>
                <option value="desserts">Desserts</option>
                <option value="beverages">Beverages</option>
              </select>
            </div>
          </div>

          {/* Price and Cost Price (COGS) */}
          <div className="grid grid-cols-2 gap-3 bg-emerald-500/5 dark:bg-emerald-500/10 p-3.5 rounded-2xl border border-emerald-500/20">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-200 uppercase mb-1">
                Selling Price (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input
                  name="price"
                  type="number"
                  min="1"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="199"
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-1">
                Cost Price / COGS (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input
                  name="costPrice"
                  type="number"
                  min="0"
                  value={form.costPrice}
                  onChange={handleChange}
                  placeholder="85"
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>
            </div>
            {Number(form.price) > 0 && Number(form.costPrice) > 0 && (
              <div className="col-span-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex justify-between pt-1 border-t border-emerald-500/20">
                <span>Unit Profit: ₹{Math.max(0, Number(form.price) - Number(form.costPrice))}</span>
                <span>Margin: {Math.round(((Number(form.price) - Number(form.costPrice)) / Number(form.price)) * 100)}%</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              placeholder="Fresh herb-infused tomato sauce with 100% mozzarella..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1.5">
              <FiImage className="inline mr-1" />
              Image URL
            </label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* Veg Toggle */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isVegCheck"
              name="isVeg"
              checked={form.isVeg}
              onChange={handleChange}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-gray-300"
            />
            <label htmlFor="isVegCheck" className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Vegetarian Item (Green Badge)
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all disabled:opacity-60"
            >
              {saving ? 'Saving…' : editItem ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Menu Page ───────────────────────────────────────────────────────────
export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [toast, setToast] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Bootstrap admin token for dev (so the api.js interceptor sends it)
  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      localStorage.setItem('authToken', ADMIN_SECRET);
    }
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const loadItems = async () => {
    setLoading(true);
    try {
      // Fetch ALL items including unavailable for admin view
      const data = await fetchAllMenuItems();
      setItems(data);
    } catch (err) {
      showToast('Failed to load menu items.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleOpenAdd = () => {
    setEditItem(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditItem(item);
    setModalOpen(true);
  };

  const handleSaved = (saved, isEdit) => {
    if (isEdit) {
      setItems((prev) => prev.map((i) => (i.id === saved.id ? saved : i)));
      showToast(`"${saved.name}" updated successfully.`);
    } else {
      setItems((prev) => [saved, ...prev]);
      showToast(`"${saved.name}" added to the menu!`);
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      localStorage.setItem('authToken', ADMIN_SECRET);
      const updated = await editMenuItem(item.id, { isAvailable: !item.isAvailable });
      setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      showToast(
        updated.isAvailable
          ? `"${updated.name}" is now available on the menu.`
          : `"${updated.name}" has been hidden from customers.`
      );
    } catch (err) {
      showToast(err?.response?.data?.error || 'Failed to update availability.', 'error');
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Deactivate "${item.name}"? It will no longer appear on the customer menu.`)) return;
    setDeletingId(item.id);
    try {
      localStorage.setItem('authToken', ADMIN_SECRET);
      await removeMenuItem(item.id);
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, isAvailable: false } : i)));
      showToast(`"${item.name}" has been deactivated.`);
    } catch (err) {
      showToast(err?.response?.data?.error || 'Failed to deactivate item.', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredItems = items.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const availableCount = items.filter((i) => i.isAvailable).length;
  const unavailableCount = items.filter((i) => !i.isAvailable).length;

  return (
    <div className="space-y-6 pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight flex items-center gap-2">
            <GiFullPizza className="text-primary text-3xl" />
            Menu Management & Costing
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Single source of truth — Configure Selling Prices, Cost Prices (COGS), and stock availability in MongoDB.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all self-start sm:self-auto"
        >
          <FiPlus className="text-lg" />
          Add Item
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-2xl">
            <FiPackage />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase">Total Catalog Items</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{items.length}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-2xl">
            <FiEye />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase">Available on App</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{availableCount}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-gray-800 p-5 shadow-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gray-500/10 text-gray-400 flex items-center justify-center text-2xl">
            <FiEyeOff />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase">Hidden / Out of Stock</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{unavailableCount}</p>
          </div>
        </div>
      </div>

      {/* Category Tabs Filter */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'all', label: 'All Items' },
          { id: 'veg-pizza', label: 'Veg Pizzas' },
          { id: 'non-veg-pizza', label: 'Non-Veg Pizzas' },
          { id: 'pizza-mania', label: 'Pizza Mania' },
          { id: 'sides', label: 'Sides & Dips' },
          { id: 'desserts', label: 'Desserts' },
          { id: 'beverages', label: 'Beverages' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === tab.id
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Menu Table */}
      <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-card overflow-hidden">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Domino's Menu Catalog</h2>

        {loading ? (
          <TableSkeleton />
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <GiFullPizza className="text-5xl mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No items found in this category.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-xs font-semibold uppercase text-gray-400">
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Selling Price</th>
                  <th className="py-3 px-4 text-center">Cost Price (COGS)</th>
                  <th className="py-3 px-4 text-center">Gross Profit</th>
                  <th className="py-3 px-4 text-center">Margin</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50 text-sm">
                {filteredItems.map((item) => {
                  const basePrice = item.price || item.sizes?.S || 0;
                  const cost = item.costPrice || Math.round(basePrice * 0.45);
                  const profit = Math.max(0, basePrice - cost);
                  const marginPct = basePrice > 0 ? Math.round((profit / basePrice) * 100) : 0;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${
                        !item.isAvailable ? 'opacity-50' : ''
                      }`}
                    >
                      {/* Pizza name + thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-11 h-11 rounded-xl object-cover flex-shrink-0 bg-gray-100 shadow-sm"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-xl">
                              <GiFullPizza />
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-gray-800 dark:text-white block">{item.name}</span>
                            <span className="text-xs text-gray-400 block line-clamp-1 max-w-xs">{item.description || '—'}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 capitalize">
                          {item.category?.replace('-', ' ') || 'Pizza'}
                        </span>
                      </td>

                      {/* Selling Price */}
                      <td className="py-3.5 px-4 text-center font-bold text-gray-900 dark:text-white">
                        ₹{basePrice}
                      </td>

                      {/* Cost Price (COGS) */}
                      <td className="py-3.5 px-4 text-center font-semibold text-emerald-600 dark:text-emerald-400">
                        ₹{cost}
                      </td>

                      {/* Unit Profit */}
                      <td className="py-3.5 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{profit}
                      </td>

                      {/* Profit Margin */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          {marginPct}%
                        </span>
                      </td>

                      {/* Status badge */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            item.isAvailable
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-gray-500/10 text-gray-400'
                          }`}
                        >
                          {item.isAvailable ? 'Available' : 'Deactivated'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-1">
                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEdit(item)}
                            title="Edit item & cost"
                            className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/10 transition-colors"
                          >
                            <FiEdit2 />
                          </button>

                          {/* Toggle availability */}
                          <button
                            onClick={() => handleToggleAvailability(item)}
                            title={item.isAvailable ? 'Hide from customer menu' : 'Restore to customer menu'}
                            className={`p-2 rounded-lg transition-colors ${
                              item.isAvailable
                                ? 'text-gray-400 hover:text-amber-500 hover:bg-amber-500/10'
                                : 'text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10'
                            }`}
                          >
                            {item.isAvailable ? <FiToggleRight className="text-lg text-emerald-500" /> : <FiToggleLeft className="text-lg" />}
                          </button>

                          {/* Soft-delete */}
                          <button
                            onClick={() => handleDelete(item)}
                            disabled={deletingId === item.id}
                            title="Deactivate item"
                            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <MenuFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
        editItem={editItem}
      />

      {/* Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

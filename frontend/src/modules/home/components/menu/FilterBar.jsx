import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { VegBadge } from '../common/VegBadge.jsx';

export const FilterBar = ({
  searchQuery = '',
  onSearchChange,
  vegFilter = '', // '', 'true', 'false'
  onVegFilterChange,
  sortBy = 'popular',
  onSortByChange,
  totalResults = 0,
}) => {
  return (
    <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Margherita, Pepper BBQ, Garlic Bread..."
            className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:border-dominos-blue focus:ring-1 focus:ring-dominos-blue"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Veg / Non-Veg Toggle Filter Buttons */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-start">
          <button
            type="button"
            onClick={() => onVegFilterChange(vegFilter === 'true' ? '' : 'true')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              vegFilter === 'true'
                ? 'border-emerald-600 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <VegBadge isVeg={true} size="sm" />
            <span>Veg Only</span>
          </button>

          <button
            type="button"
            onClick={() => onVegFilterChange(vegFilter === 'false' ? '' : 'false')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              vegFilter === 'false'
                ? 'border-dominos-red bg-red-50 text-dominos-red ring-1 ring-red-500'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <VegBadge isVeg={false} size="sm" />
            <span>Non-Veg</span>
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="py-2 pl-3 pr-8 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:border-dominos-blue cursor-pointer"
            >
              <option value="popular">Popularity</option>
              <option value="rating">Rating: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Result Count and Active Filters Strip */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
        <span>Showing <strong>{totalResults}</strong> delicious items</span>
        {(searchQuery || vegFilter) && (
          <button
            onClick={() => {
              onSearchChange('');
              onVegFilterChange('');
            }}
            className="text-dominos-red font-semibold hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};


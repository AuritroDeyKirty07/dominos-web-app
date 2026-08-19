import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCategories, getMenuItems } from '../services/menuService.js';
import { ProductCard } from '../components/menu/ProductCard.jsx';
import { CategoryBar } from '../components/menu/CategoryBar.jsx';
import { FilterBar } from '../components/menu/FilterBar.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { Pizza, UtensilsCrossed } from 'lucide-react';

export const MenuPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters from URL or default
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const vegParam = searchParams.get('isVeg') || '';
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const [catsData, itemsData] = await Promise.all([
          getCategories(),
          getMenuItems({
            category: categoryParam,
            search: searchParam,
            isVeg: vegParam,
          }),
        ]);
        setCategories(catsData);
        setMenuItems(itemsData);
      } catch (err) {
        console.error('Failed to load menu items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [categoryParam, searchParam, vegParam]);

  const handleCategorySelect = (catId) => {
    const nextParams = new URLSearchParams(searchParams);
    if (catId === 'all') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', catId);
    }
    setSearchParams(nextParams);
  };

  const handleSearchChange = (query) => {
    const nextParams = new URLSearchParams(searchParams);
    if (query) {
      nextParams.set('search', query);
    } else {
      nextParams.delete('search');
    }
    setSearchParams(nextParams);
  };

  const handleVegFilterChange = (val) => {
    const nextParams = new URLSearchParams(searchParams);
    if (val) {
      nextParams.set('isVeg', val);
    } else {
      nextParams.delete('isVeg');
    }
    setSearchParams(nextParams);
  };

  // Sort items
  const sortedItems = [...menuItems].sort((a, b) => {
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    // Default popular
    if (a.isBestseller && !b.isBestseller) return -1;
    if (!a.isBestseller && b.isBestseller) return 1;
    return (b.reviewsCount || 0) - (a.reviewsCount || 0);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-black font-brand text-slate-900 tracking-wide">
            EXPLORE DOMINO'S MENU
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Fresh dough, rich marinara, real mozzarella & toppings of your choice
          </p>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <CategoryBar
        categories={categories}
        selectedCategory={categoryParam}
        onSelectCategory={handleCategorySelect}
      />

      {/* Filter and Search Bar */}
      <FilterBar
        searchQuery={searchParam}
        onSearchChange={handleSearchChange}
        vegFilter={vegParam}
        onVegFilterChange={handleVegFilterChange}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        totalResults={sortedItems.length}
      />

      {/* Product Grid or States */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-20">
          <Spinner size="lg" />
          <p className="text-xs text-slate-500 mt-3 font-semibold">Baking fresh menu items...</p>
        </div>
      ) : sortedItems.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="No pizzas matched your search"
          description="Try changing your search term, resetting your veg/non-veg filter, or selecting a different category."
          actionText="Clear All Filters"
          onAction={() => setSearchParams({})}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {sortedItems.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
};

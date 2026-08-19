import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../services/menuService.js';
import { Spinner } from '../components/common/Spinner.jsx';
import {
  Sparkles,
  Leaf,
  Flame,
  Zap,
  Utensils,
  Heart,
  Coffee,
  ArrowRight,
  Pizza,
} from 'lucide-react';

const iconMap = {
  Sparkles,
  Leaf,
  Flame,
  Zap,
  Utensils,
  Heart,
  Coffee,
};

const categoryImages = {
  'veg-pizza': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
  'non-veg-pizza': 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80',
  'pizza-mania': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
  'sides': 'https://neonpolice.com/wp-content/uploads/2024/02/Dominos-Dips-1.webp',
  'desserts': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
  'beverages': 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=600&q=80',
};

export const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data.filter(c => c.id !== 'all'));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black font-brand text-slate-900 tracking-wide">
          DOMINO'S CATEGORIES
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore our handcrafted pizzas, crispy sides, molten lava desserts, and beverages
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const IconComponent = iconMap[cat.icon] || Pizza;
            const bgImage = categoryImages[cat.id] || categoryImages['veg-pizza'];

            return (
              <div
                key={cat.id}
                onClick={() => navigate(`/menu?category=${cat.id}`)}
                className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-dominos border border-slate-200 cursor-pointer bg-white transition-all duration-300 hover:-translate-y-1"
              >
                {/* Media preview */}
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-800">
                  <img
                    src={bgImage}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Icon badge */}
                  <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-white/95 backdrop-blur-sm text-dominos-blue flex items-center justify-center shadow-md">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Item count */}
                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="text-xs font-bold bg-dominos-red px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {cat.count || 4} Items
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-dominos-blue transition-colors font-brand">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {cat.description}
                    </p>
                  </div>

                  <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-dominos-blue group-hover:text-white text-slate-600 flex items-center justify-center transition-colors flex-shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};


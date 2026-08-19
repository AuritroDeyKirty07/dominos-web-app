import React from 'react';
import {
  Sparkles,
  Leaf,
  Flame,
  Zap,
  Utensils,
  Heart,
  Coffee,
  Pizza,
} from 'lucide-react';

const iconMap = {
  Sparkles: Sparkles,
  Leaf: Leaf,
  Flame: Flame,
  Zap: Zap,
  Utensils: Utensils,
  Heart: Heart,
  Coffee: Coffee,
  Pizza: Pizza,
};

export const CategoryBar = ({
  categories = [],
  selectedCategory = 'all',
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar py-1">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const IconComponent = iconMap[cat.icon] || Pizza;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex-shrink-0 ${
              isSelected
                ? 'bg-dominos-blue text-white shadow-dominos ring-2 ring-dominos-blue/20 scale-[1.02]'
                : 'bg-white text-slate-700 hover:text-slate-950 hover:bg-slate-100/80 border border-slate-200 shadow-sm'
            }`}
          >
            <IconComponent className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-dominos-blue'}`} />
            <span>{cat.name}</span>
            {cat.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {cat.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

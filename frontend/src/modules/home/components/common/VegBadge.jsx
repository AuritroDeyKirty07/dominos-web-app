import React from 'react';

export const VegBadge = ({ isVeg, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5 border-[1.5px] p-[1.5px]',
    md: 'w-4 h-4 border-2 p-[2px]',
    lg: 'w-5 h-5 border-2 p-[3px]',
  };

  const dotClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  if (isVeg) {
    return (
      <span
        title="100% Vegetarian"
        className={`inline-flex items-center justify-center rounded-[3px] border-emerald-600 bg-white shadow-sm flex-shrink-0 ${sizeClasses[size]}`}
      >
        <span className={`rounded-full bg-emerald-600 ${dotClasses[size]}`}></span>
      </span>
    );
  }

  return (
    <span
      title="Non-Vegetarian"
      className={`inline-flex items-center justify-center rounded-[3px] border-dominos-red bg-white shadow-sm flex-shrink-0 ${sizeClasses[size]}`}
    >
      <span className={`rounded-full bg-dominos-red ${dotClasses[size]}`}></span>
    </span>
  );
};

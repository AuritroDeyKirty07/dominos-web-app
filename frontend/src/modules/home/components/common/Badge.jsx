import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-dominos-blue/10 text-dominos-blue border-dominos-blue/20 font-semibold',
    secondary: 'bg-slate-800 text-white border-transparent',
    danger: 'bg-red-50 text-dominos-red border-red-200 font-semibold',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold',
    warning: 'bg-amber-50 text-amber-800 border-amber-200 font-medium',
    brand: 'bg-dominos-red text-white border-transparent font-bold tracking-wide uppercase shadow-sm',
    accent: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};


import React from 'react';
import { Button } from './Button.jsx';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm max-w-md mx-auto my-6">
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-dominos-blue mb-4">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-xl font-bold text-slate-800 font-brand">{title}</h3>
      {description && <p className="text-sm text-slate-500 mt-2 max-w-xs">{description}</p>}

      {(actionText || secondaryActionText) && (
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 w-full justify-center">
          {actionText && (
            <Button variant="primary" onClick={onAction} className="w-full sm:w-auto">
              {actionText}
            </Button>
          )}
          {secondaryActionText && (
            <Button variant="secondary" onClick={onSecondaryAction} className="w-full sm:w-auto">
              {secondaryActionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

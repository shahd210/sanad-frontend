import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating = 0, reviewCount = null, size = 'sm', className = '' }) => {
  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`} aria-label={`Rating: ${rating} out of 5 stars`}>
      <div className="flex items-center text-amber-400">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.floor(rating);
          const partial = !filled && star === Math.ceil(rating) && rating % 1 >= 0.4;
          return (
            <Star
              key={star}
              className={`${iconSizes[size]} ${
                filled
                  ? 'fill-amber-400 text-amber-400'
                  : partial
                  ? 'fill-amber-400 text-amber-400 opacity-70'
                  : 'text-slate-300'
              }`}
              aria-hidden="true"
            />
          );
        })}
      </div>
      <span className={`font-bold text-slate-800 ${textSizes[size]}`}>
        {Number(rating).toFixed(1)}
      </span>
      {reviewCount !== null && (
        <span className={`text-slate-500 ${textSizes[size]}`}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
};

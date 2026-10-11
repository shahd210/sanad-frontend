import React, { useState } from 'react';
import { BadgeCheck } from 'lucide-react';
import { useI18n } from '../i18n/useI18n.jsx';

export const VerifiedBadge = ({ size = 'md', showLabel = true, className = '' }) => {
  const { t } = useI18n();
  const [showTooltip, setShowTooltip] = useState(false);

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm',
  };

  return (
    <div
      className={`relative inline-flex items-center gap-1 ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      tabIndex={0}
      role="tooltip"
      aria-label={t('card.verifiedTooltip')}
    >
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium bg-teal-50 text-teal-700 border border-teal-200">
        <BadgeCheck className={`${iconSizes[size]} text-teal-600 flex-shrink-0`} aria-hidden="true" />
        {showLabel && <span className={`${textSizes[size]}`}>{t('card.verified')}</span>}
      </span>

      {/* Tooltip */}
      {showTooltip && (
        <div
          role="status"
          className="absolute bottom-full mb-1.5 start-0 z-30 w-56 p-2 text-xs font-normal text-white bg-slate-900 rounded-lg shadow-lg pointer-events-none transform transition-opacity duration-150"
        >
          {t('card.verifiedTooltip')}
          <div className="absolute top-full start-4 -mt-1 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
};

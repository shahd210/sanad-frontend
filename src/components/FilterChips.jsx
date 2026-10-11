import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { useI18n } from '../i18n/useI18n.jsx';

export const FilterChips = ({
  chips = [],
  totalCount = 0,
  loading = false,
  onRemoveChip,
  onClearAll,
}) => {
  const { t } = useI18n();

  const countText =
    totalCount === 1
      ? t('results.found_one')
      : t('results.found_other', { count: totalCount });

  return (
    <div className="mb-4">
      {/* Live announcement of results count for screen readers (WCAG AA) */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="text-sm font-bold text-slate-800 mb-2 flex items-center justify-between"
      >
        <span>{loading ? '...' : countText}</span>
        {chips.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-900 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t('results.clearAllFilters')}</span>
          </button>
        )}
      </div>

      {/* Removable chips */}
      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {chips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-900 border border-teal-200/90 shadow-2xs animate-fadeIn"
            >
              <span>{chip.label}</span>
              <button
                type="button"
                onClick={() => onRemoveChip(chip.key)}
                aria-label={`Remove filter ${chip.label}`}
                className="p-0.5 rounded-full hover:bg-teal-200/60 text-teal-700 hover:text-teal-950 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

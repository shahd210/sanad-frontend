import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { useI18n } from '../i18n/useI18n.jsx';

export const SortSelect = ({ currentSort = 'best_match', onSortChange }) => {
  const { t } = useI18n();

  const options = [
    { value: 'best_match', label: t('sort.best_match') },
    { value: 'highest_rating', label: t('sort.highest_rating') },
    { value: 'lowest_fee', label: t('sort.lowest_fee') },
    { value: 'earliest_slot', label: t('sort.earliest_slot') },
    { value: 'nearest', label: t('sort.nearest') },
  ];

  return (
    <div className="inline-flex items-center gap-2">
      <label htmlFor="sort-dropdown" className="text-xs font-semibold text-slate-500 whitespace-nowrap">
        {t('sort.label')}
      </label>
      <div className="relative inline-flex items-center">
        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute start-2.5 pointer-events-none" />
        <select
          id="sort-dropdown"
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="ps-8 pe-7 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 cursor-pointer appearance-none"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute end-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
          ▼
        </div>
      </div>
    </div>
  );
};

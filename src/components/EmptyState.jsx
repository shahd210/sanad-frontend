import React from 'react';
import { SearchX, RotateCcw, Sparkles } from 'lucide-react';
import { useI18n } from '../i18n/useI18n.jsx';

export const EmptyState = ({ onResetFilters, onSelectSuggestion }) => {
  const { lang, t } = useI18n();

  const suggestedQueries = [
    { en: 'Toothache & Dentistry', ar: 'ألم الأسنان والطب وجراحة الفم', query: 'toothache' },
    { en: 'Dermatologist in New Cairo', ar: 'جلدية بالتجمع الخامس', query: 'Dermatology' },
    { en: 'Pediatrics in Maadi', ar: 'أطفال في المعادي', query: 'Pediatrics' },
    { en: 'Back pain & Orthopedics', ar: 'ألم الظهر وعظام', query: 'back pain' },
  ];

  return (
    <div
      role="region"
      aria-label="No results"
      className="p-8 sm:p-12 text-center bg-white rounded-3xl border border-slate-200/90 shadow-soft max-w-xl mx-auto my-6"
    >
      <div className="w-16 h-16 rounded-3xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4 border border-teal-100 shadow-2xs">
        <SearchX className="w-8 h-8" />
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
        {t('states.emptyTitle')}
      </h3>

      <p className="text-sm text-slate-500 mb-6 leading-relaxed">
        {t('states.emptyMessage')}
      </p>

      {/* Primary Reset Action */}
      <button
        type="button"
        onClick={onResetFilters}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-sm transition-transform active:scale-95 touch-target focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-700 mb-6"
      >
        <RotateCcw className="w-4 h-4" />
        <span>{t('states.emptyResetBtn')}</span>
      </button>

      {/* Suggested Search Terms */}
      <div className="pt-6 border-t border-slate-100">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>{t('states.emptySuggestions')}</span>
        </p>

        <div className="flex flex-wrap justify-center gap-2">
          {suggestedQueries.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectSuggestion && onSelectSuggestion(item.query)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 transition-colors"
            >
              {lang === 'ar' ? item.ar : item.en}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

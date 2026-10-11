import React, { useState } from 'react';
import { Sparkles, ArrowRightLeft, X, Check } from 'lucide-react';
import { useI18n } from '../i18n/useI18n.jsx';
import { SPECIALTIES } from '../data/conditions.js';

export const ConditionBanner = ({
  condition,
  currentSpecialtyId,
  onChangeSpecialty,
  onClear,
}) => {
  const { lang, t } = useI18n();
  const [isChanging, setIsChanging] = useState(false);

  if (!condition) return null;

  const conditionName = lang === 'ar' ? condition.ar : condition.en;
  const currentSpecialty = SPECIALTIES.find((s) => s.id === currentSpecialtyId) || {
    id: condition.specialtyId,
    en: condition.specialtyEn,
    ar: condition.specialtyAr,
  };
  const specialtyName = lang === 'ar' ? currentSpecialty.ar : currentSpecialty.en;

  return (
    <div className="mb-5 p-3.5 sm:p-4 rounded-xl bg-teal-50 border border-teal-200/90 text-teal-900 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-teal-600 text-white flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-sm">
            <span className="font-medium text-teal-700 me-1">
              {t('search.conditionBannerPrefix')}
            </span>
            <span className="font-bold text-teal-950 underline decoration-teal-400 underline-offset-2">
              {specialtyName}
            </span>
            <span className="font-medium text-teal-700 ms-1 me-1">
              {t('search.conditionBannerFor')}
            </span>
            <span className="font-bold text-teal-900 bg-teal-100/80 px-2 py-0.5 rounded-md text-xs sm:text-sm">
              &ldquo;{conditionName}&rdquo;
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={() => setIsChanging(!isChanging)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-800 bg-white hover:bg-teal-100/60 rounded-lg border border-teal-300 shadow-2xs transition-colors"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-teal-600" />
            <span>{t('search.changeSpecialty')}</span>
          </button>

          {onClear && (
            <button
              type="button"
              onClick={onClear}
              aria-label={t('search.clearSearch')}
              className="p-1.5 text-teal-600 hover:text-teal-900 hover:bg-teal-100/60 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Specialty switcher inline popdown */}
      {isChanging && (
        <div className="mt-3 pt-3 border-t border-teal-200/80 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 animate-fadeIn">
          {SPECIALTIES.map((spec) => {
            const isSelected = spec.id === currentSpecialtyId;
            return (
              <button
                key={spec.id}
                type="button"
                onClick={() => {
                  onChangeSpecialty(spec.id);
                  setIsChanging(false);
                }}
                className={`text-start px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-teal-700 text-white font-bold'
                    : 'bg-white hover:bg-teal-100/80 text-slate-700 border border-teal-200/60'
                }`}
              >
                <span className="truncate">{lang === 'ar' ? spec.ar : spec.en}</span>
                {isSelected && <Check className="w-3.5 h-3.5 flex-shrink-0 ms-1" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

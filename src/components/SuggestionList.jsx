import React from 'react';
import { Stethoscope, User, Building2, ArrowUpRight, Sparkles } from 'lucide-react';
import { useI18n } from '../i18n/useI18n.jsx';

export const SuggestionList = ({
  suggestions,
  isOpen,
  activeIndex,
  onSelectCondition,
  onSelectDoctor,
  onSelectClinic,
  onClose,
}) => {
  const { lang, t } = useI18n();

  if (!isOpen) return null;

  const { conditions = [], doctors = [], clinics = [] } = suggestions;
  const hasResults = conditions.length > 0 || doctors.length > 0 || clinics.length > 0;

  if (!hasResults) return null;

  let flatIndex = 0;

  return (
    <div
      role="listbox"
      id="search-suggestions-list"
      aria-label="Search suggestions"
      className="absolute start-0 end-0 top-full mt-2 bg-white rounded-2xl shadow-soft-lg border border-slate-200/80 overflow-hidden z-50 divide-y divide-slate-100 max-h-[75vh] overflow-y-auto"
    >
      {/* 1. Group: Conditions -> Specialty (FR-SAN-09, 10) */}
      {conditions.length > 0 && (
        <div className="p-2 sm:p-3 bg-teal-50/40">
          <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-teal-800 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>{t('search.suggestions.conditions')}</span>
          </div>
          <div className="space-y-1 mt-1">
            {conditions.map((item) => {
              const currentIndex = flatIndex++;
              const isSelected = activeIndex === currentIndex;
              const condName = lang === 'ar' ? item.ar : item.en;
              const specName = lang === 'ar' ? item.specialtyAr : item.specialtyEn;

              return (
                <div
                  key={item.id}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => onSelectCondition(item)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected ? 'bg-teal-100/80 text-teal-900' : 'hover:bg-teal-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-teal-100 text-teal-700">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{condName}</div>
                      <div className="text-xs text-teal-700">
                        {t('search.suggestions.specialtyMapping')}: <span className="font-bold">{specName}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-teal-600 text-white flex items-center gap-0.5">
                    {specName}
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Group: Doctors */}
      {doctors.length > 0 && (
        <div className="p-2 sm:p-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>{t('search.suggestions.doctors')}</span>
          </div>
          <div className="space-y-1 mt-1">
            {doctors.map((item) => {
              const currentIndex = flatIndex++;
              const isSelected = activeIndex === currentIndex;
              const docName = lang === 'ar' ? item.nameAr : item.nameEn;
              const docSpec = lang === 'ar' ? item.specialtyAr : item.specialtyEn;
              const docArea = lang === 'ar' ? item.areaAr : item.areaEn;

              return (
                <div
                  key={item.id}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => onSelectDoctor(item)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected ? 'bg-slate-100 text-slate-900' : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.avatar}
                      alt={docName}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{docName}</div>
                      <div className="text-xs text-slate-500">
                        {docSpec} • {docArea}
                      </div>
                    </div>
                  </div>
                  <div className="text-end">
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      ★ {item.rating}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Group: Clinics & Medical Centers */}
      {clinics.length > 0 && (
        <div className="p-2 sm:p-3 bg-slate-50/60">
          <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>{t('search.suggestions.clinics')}</span>
          </div>
          <div className="space-y-1 mt-1">
            {clinics.map((item) => {
              const currentIndex = flatIndex++;
              const isSelected = activeIndex === currentIndex;
              const clinicName = lang === 'ar' ? item.nameAr : item.nameEn;
              const clinicArea = lang === 'ar' ? item.areaAr : item.areaEn;

              return (
                <div
                  key={item.id}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => onSelectClinic(item)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected ? 'bg-slate-200/70 text-slate-900' : 'hover:bg-white text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-teal-100 text-teal-700 flex-shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{clinicName}</div>
                      <div className="text-xs text-slate-500">{clinicArea}</div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {item.branches?.length || 1} {lang === 'ar' ? 'فروع' : 'branches'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

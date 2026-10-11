import React, { useState, useEffect } from 'react';
import { RotateCcw, Filter, MapPin, Calendar, Globe, Stethoscope, Star, Banknote, CreditCard, Building2 } from 'lucide-react';
import { useI18n } from '../i18n/useI18n.jsx';
import { LOCATIONS, SPECIALTIES } from '../data/conditions.js';
import { fetchClinics } from '../api/providersApi.js';

export const FiltersPanel = ({
  filters,
  onFilterChange,
  onResetFilters,
  className = '',
  isMobile = false,
}) => {
  const { lang, t } = useI18n();
  const [clinics, setClinics] = useState([]);

  useEffect(() => {
    let isMounted = true;
    fetchClinics().then((data) => {
      if (isMounted && data) {
        setClinics(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelect = (field, value) => {
    onFilterChange({ [field]: value });
  };

  return (
    <aside
      className={`bg-white rounded-2xl border border-slate-200/90 p-5 ${
        isMobile ? 'border-none p-0' : 'shadow-soft'
      } ${className}`}
      aria-label={t('filters.title')}
    >
      {/* Header (desktop only) */}
      {!isMobile && (
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
            <Filter className="w-4 h-4 text-teal-600" />
            <span>{t('filters.title')}</span>
          </div>
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-teal-700 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t('filters.reset')}</span>
          </button>
        </div>
      )}

      <div className="space-y-5">
        {/* 1. Location / Area */}
        <div>
          <label htmlFor="filter-location" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            <span>{t('filters.location')}</span>
          </label>
          <select
            id="filter-location"
            value={filters.location || 'all'}
            onChange={(e) => handleSelect('location', e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 bg-slate-50/50 hover:bg-slate-50 focus:border-teal-600 focus:bg-white transition-colors"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {lang === 'ar' ? loc.ar : loc.en}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Medical Specialty */}
        <div>
          <label htmlFor="filter-specialty" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
            <span>{t('filters.specialty')}</span>
          </label>
          <select
            id="filter-specialty"
            value={filters.specialty || 'all'}
            onChange={(e) => handleSelect('specialty', e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 bg-slate-50/50 hover:bg-slate-50 focus:border-teal-600 focus:bg-white transition-colors"
          >
            <option value="all">{t('filters.allSpecialties')}</option>
            {SPECIALTIES.map((spec) => (
              <option key={spec.id} value={spec.id}>
                {lang === 'ar' ? spec.ar : spec.en}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Availability Filter (Today / Tomorrow / This week) */}
        <div>
          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span>{t('filters.availability')}</span>
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'all', label: t('filters.availAny') },
              { id: 'today', label: t('filters.availToday') },
              { id: 'tomorrow', label: t('filters.availTomorrow') },
              { id: 'week', label: t('filters.availWeek') },
            ].map((item) => {
              const active = (filters.availability || 'all') === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect('availability', item.id)}
                  className={`p-2 rounded-xl text-xs font-medium text-center transition-colors ${
                    active
                      ? 'bg-teal-600 text-white font-bold shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Visit Type (In-clinic, Online, Home) */}
        <div>
          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
            <span>{t('filters.visitType')}</span>
          </span>
          <div className="space-y-1.5">
            {[
              { id: 'all', label: t('filters.visitAny') },
              { id: 'clinic', label: t('filters.inClinic') },
              { id: 'online', label: t('filters.online') },
              { id: 'home', label: t('filters.home') },
            ].map((v) => {
              const active = (filters.visitType || 'all') === v.id;
              return (
                <label
                  key={v.id}
                  className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer text-xs transition-colors ${
                    active ? 'bg-teal-50 text-teal-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="visitType"
                    checked={active}
                    onChange={() => handleSelect('visitType', v.id)}
                    className="accent-teal-600 text-teal-600 w-4 h-4"
                  />
                  <span>{v.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 5. Minimum Rating (Any, 3+, 4+, 4.5+) */}
        <div>
          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{t('filters.rating')}</span>
          </span>
          <div className="flex items-center gap-1.5">
            {[
              { val: '0', label: t('filters.ratingAny') },
              { val: '3', label: '3+' },
              { val: '4', label: '4+' },
              { val: '4.5', label: '4.5+' },
            ].map((r) => {
              const active = String(filters.minRating || '0') === r.val;
              return (
                <button
                  key={r.val}
                  type="button"
                  onClick={() => handleSelect('minRating', r.val)}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Consultation Fee Range */}
        <div>
          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            <Banknote className="w-3.5 h-3.5 text-teal-600" />
            <span>{t('filters.fee')}</span>
          </span>
          <div className="space-y-1.5">
            {[
              { id: 'all', label: t('filters.feeAny') },
              { id: 'under-300', label: t('filters.feeUnder300') },
              { id: '300-450', label: t('filters.fee300To450') },
              { id: 'above-450', label: t('filters.feeAbove450') },
            ].map((fee) => {
              const active = (filters.feeRange || 'all') === fee.id;
              return (
                <label
                  key={fee.id}
                  className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer text-xs transition-colors ${
                    active ? 'bg-teal-50 text-teal-900 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="feeRange"
                    checked={active}
                    onChange={() => handleSelect('feeRange', fee.id)}
                    className="accent-teal-600 text-teal-600 w-4 h-4"
                  />
                  <span>{fee.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 7. Language */}
        <div>
          <label htmlFor="filter-language" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            <Globe className="w-3.5 h-3.5 text-teal-600" />
            <span>{t('filters.language')}</span>
          </label>
          <select
            id="filter-language"
            value={filters.language || 'all'}
            onChange={(e) => handleSelect('language', e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 bg-slate-50/50 hover:bg-slate-50 focus:border-teal-600 focus:bg-white transition-colors"
          >
            <option value="all">{t('filters.langAny')}</option>
            <option value="Arabic">{t('filters.arabic')}</option>
            <option value="English">{t('filters.english')}</option>
            <option value="French">{t('filters.french')}</option>
            <option value="German">{t('filters.german')}</option>
          </select>
        </div>

        {/* 8. Payment Method */}
        <div>
          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            <CreditCard className="w-3.5 h-3.5 text-teal-600" />
            <span>{t('filters.payment')}</span>
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'all', label: t('filters.payAny') },
              { id: 'card', label: t('filters.card') },
              { id: 'wallet', label: t('filters.wallet') },
              { id: 'cash', label: t('filters.cash') },
            ].map((p) => {
              const active = (filters.paymentMethod || 'all') === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelect('paymentMethod', p.id)}
                  className={`p-2 rounded-xl text-xs font-medium text-center truncate transition-colors ${
                    active
                      ? 'bg-teal-600 text-white font-bold shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 9. Specific Clinic */}
        <div>
          <label htmlFor="filter-clinic" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5 text-teal-600" />
            <span>{t('filters.clinic')}</span>
          </label>
          <select
            id="filter-clinic"
            value={filters.clinicId || 'all'}
            onChange={(e) => handleSelect('clinicId', e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 bg-slate-50/50 hover:bg-slate-50 focus:border-teal-600 focus:bg-white transition-colors"
          >
            <option value="all">{t('filters.allClinics')}</option>
            {clinics.map((c) => (
              <option key={c.id} value={c.id}>
                {lang === 'ar' ? c.nameAr : c.nameEn}
              </option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  );
};

import React, { useState } from 'react';
import { SlidersHorizontal, List, Map, ChevronDown } from 'lucide-react';
import { useI18n } from '../i18n/useI18n.jsx';
import { useProviderSearch } from '../hooks/useProviderSearch.js';
import { SearchBar } from '../components/SearchBar.jsx';
import { EmergencyBanner } from '../components/EmergencyBanner.jsx';
import { ConditionBanner } from '../components/ConditionBanner.jsx';
import { FiltersPanel } from '../components/FiltersPanel.jsx';
import { FilterChips } from '../components/FilterChips.jsx';
import { SortSelect } from '../components/SortSelect.jsx';
import { ProviderCard } from '../components/ProviderCard.jsx';
import { SponsoredSection } from '../components/SponsoredCard.jsx';
import { MapViewPlaceholder } from '../components/MapViewPlaceholder.jsx';
import { ProviderCardSkeleton, FiltersSkeleton } from '../components/Skeletons.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { ErrorState } from '../components/ErrorState.jsx';
import { BottomSheet } from '../components/BottomSheet.jsx';
import { Toast } from '../components/Toast.jsx';

export const SearchPage = () => {
  const { lang, t } = useI18n();
  const {
    filters,
    loading,
    error,
    providers,
    sponsoredProviders,
    totalCount,
    emergencyAlert,
    conditionMatch,
    activeFilterChips,
    activeFiltersCount,
    updateFilters,
    setSearch,
    setSpecialty,
    clearCondition,
    clearAllFilters,
    removeFilter,
    retry,
  } = useProviderSearch();

  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [toastInfo, setToastInfo] = useState({ isOpen: false, title: '', message: '' });
  const [visibleCount, setVisibleCount] = useState(6);

  const handleSearchSubmit = (query, location, extra = {}) => {
    if (extra.conditionId && extra.specialtyId) {
      updateFilters({
        q: query,
        location: location === 'all' ? null : location,
        condition: extra.conditionId,
        specialty: extra.specialtyId,
      });
    } else {
      setSearch(query, location);
    }
  };

  const handleBookAppointment = (doctor, slot) => {
    const docName = lang === 'ar' ? doctor.nameAr : doctor.nameEn;
    const slotText = slot
      ? `${lang === 'ar' ? slot.dayAr : slot.dayEn} @ ${slot.time}`
      : 'Default schedule';

    setToastInfo({
      isOpen: true,
      title: t('details.outOfScopeNotice'),
      message: `${t('details.outOfScopeMsg')} (${docName} - ${slotText})`,
    });
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const displayedProviders = providers.slice(0, visibleCount);

  return (
    <main className="min-h-screen bg-slate-50/60 pb-16">
      {/* Hero / Search Section */}
      <section className="bg-gradient-to-b from-teal-900 via-teal-800 to-teal-900 text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center mb-6">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-3">
            {lang === 'ar'
              ? 'احجز مع أفضل الأطباء والمراكز الطبية المعتمدة في مصر'
              : 'Find & Book Egypt’s Top Verified Doctors & Clinics'}
          </h1>
          <p className="text-sm sm:text-base text-teal-100 max-w-2xl mx-auto leading-relaxed">
            {lang === 'ar'
              ? 'منظومة رعاية صحية ذكية وسريعة. فحص وتدقيق للأطباء مع التزام كامل بالشفافية وجودة الرعاية.'
              : 'Verified credentials, transparent consultation fees, real patient reviews, and immediate scheduling.'}
          </p>
        </div>

        {/* Search Bar (FR-SAN-09, 10) */}
        <div className="max-w-4xl mx-auto">
          <SearchBar
            initialQuery={filters.q}
            initialLocation={filters.location}
            onSearch={handleSearchSubmit}
          />
        </div>
      </section>

      {/* Main Results Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* 1. Emergency Safety Override Alert (FR-SAN-11) */}
        {emergencyAlert.isEmergency && (
          <EmergencyBanner matchedTerm={emergencyAlert.matchedTerm} />
        )}

        {/* 2. Curated Condition to Specialty Banner (FR-SAN-09, 10) */}
        {conditionMatch && (
          <ConditionBanner
            condition={conditionMatch}
            currentSpecialtyId={filters.specialty}
            onChangeSpecialty={setSpecialty}
            onClear={clearCondition}
          />
        )}

        {/* Layout: Sidebar Filters + Main Results Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Desktop Filters Sidebar (FR-SAN-12) */}
          <div className="hidden lg:block lg:col-span-1 sticky top-24">
            {loading ? (
              <FiltersSkeleton />
            ) : (
              <FiltersPanel
                filters={filters}
                onFilterChange={updateFilters}
                onResetFilters={clearAllFilters}
              />
            )}
          </div>

          {/* Results Column */}
          <div className="lg:col-span-3 min-w-0">
            {/* Top Toolbar: Mobile Filter Button, View Toggle, Sorting */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 mb-4 shadow-soft flex flex-wrap items-center justify-between gap-3">
              {/* Mobile Filter Drawer Trigger */}
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200 shadow-2xs touch-target"
              >
                <SlidersHorizontal className="w-4 h-4 text-teal-600" />
                <span>{t('filters.mobileFilters')}</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-teal-700 text-white text-[11px] flex items-center justify-center font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* View Toggle: List / Map */}
              <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-teal-800 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  aria-pressed={viewMode === 'list'}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>{t('results.viewList')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('map')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'map'
                      ? 'bg-white text-teal-800 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  aria-pressed={viewMode === 'map'}
                >
                  <Map className="w-3.5 h-3.5" />
                  <span>{t('results.viewMap')}</span>
                </button>
              </div>

              {/* Sort Dropdown */}
              <SortSelect
                currentSort={filters.sort}
                onSortChange={(val) => updateFilters({ sort: val })}
              />
            </div>

            {/* Active Filters as Removable Chips + Live Count (FR-SAN-12) */}
            <FilterChips
              chips={activeFilterChips}
              totalCount={totalCount}
              loading={loading}
              onRemoveChip={removeFilter}
              onClearAll={clearAllFilters}
            />

            {/* Content Display based on State */}
            {error ? (
              <ErrorState message={error} onRetry={retry} />
            ) : loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <ProviderCardSkeleton key={n} />
                ))}
              </div>
            ) : viewMode === 'map' ? (
              <MapViewPlaceholder providers={providers} />
            ) : providers.length === 0 ? (
              <EmptyState
                onResetFilters={clearAllFilters}
                onSelectSuggestion={(sugQuery) => updateFilters({ q: sugQuery })}
              />
            ) : (
              <div>
                {/* 3. Sponsored Providers Section (FR-SAN-26: Separate position, does not alter organic rank) */}
                {sponsoredProviders.length > 0 && !emergencyAlert.isEmergency && (
                  <SponsoredSection
                    sponsoredProviders={sponsoredProviders}
                    onBookAppointment={handleBookAppointment}
                  />
                )}

                {/* 4. Organic Provider Cards List */}
                <div
                  className={`space-y-4 ${
                    emergencyAlert.isEmergency ? 'opacity-70 contrast-90' : ''
                  }`}
                >
                  {displayedProviders.map((provider) => (
                    <ProviderCard
                      key={provider.id}
                      provider={provider}
                      isDeemphasized={emergencyAlert.isEmergency}
                      onBookAppointment={handleBookAppointment}
                    />
                  ))}
                </div>

                {/* Pagination / Load More */}
                {visibleCount < providers.length && (
                  <div className="mt-8 text-center">
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm border border-slate-200/90 shadow-soft hover:shadow-soft-lg transition-all touch-target"
                    >
                      <span>
                        {lang === 'ar' ? 'عرض المزيد من الأطباء' : 'Load More Providers'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-teal-600" />
                    </button>
                    <p className="text-xs text-slate-400 mt-2">
                      {lang === 'ar'
                        ? `يتم عرض ${displayedProviders.length} من إجمالي ${providers.length} طبيب`
                        : `Showing ${displayedProviders.length} of ${providers.length} providers`}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer (FR-SAN-12) */}
      <BottomSheet
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        title={t('filters.mobileFilters')}
        footer={
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                clearAllFilters();
                setIsMobileFiltersOpen(false);
              }}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 touch-target"
            >
              {t('filters.reset')}
            </button>
            <button
              type="button"
              onClick={() => setIsMobileFiltersOpen(false)}
              className="flex-1 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm touch-target"
            >
              {t('filters.apply')}
            </button>
          </div>
        }
      >
        <FiltersPanel
          filters={filters}
          onFilterChange={updateFilters}
          onResetFilters={clearAllFilters}
          isMobile={true}
        />
      </BottomSheet>

      {/* Toast Notification (Out of scope flow reminder) */}
      <Toast
        isOpen={toastInfo.isOpen}
        onClose={() => setToastInfo({ ...toastInfo, isOpen: false })}
        title={toastInfo.title}
        message={toastInfo.message}
        type="info"
      />
    </main>
  );
};

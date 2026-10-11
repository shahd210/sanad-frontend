// Hook to manage search state, URL sync, and API interactions
// Adheres to FR-SAN-09, FR-SAN-10, FR-SAN-11, FR-SAN-12, FR-SAN-26

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProviders } from '../api/providersApi.js';
import { LOCATIONS, SPECIALTIES, CONDITIONS } from '../data/conditions.js';
import { useI18n } from '../i18n/useI18n.jsx';

export const useProviderSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { lang, t } = useI18n();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [providers, setProviders] = useState([]);
  const [sponsoredProviders, setSponsoredProviders] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [emergencyAlert, setEmergencyAlert] = useState({ isEmergency: false, matchedTerm: null });
  const [conditionMatch, setConditionMatch] = useState(null);
  const [retryNonce, setRetryNonce] = useState(0);

  // Extract parameters from URL
  const filters = useMemo(() => {
    return {
      q: searchParams.get('q') || '',
      location: searchParams.get('location') || 'all',
      specialty: searchParams.get('specialty') || 'all',
      condition: searchParams.get('condition') || '',
      availability: searchParams.get('availability') || 'all',
      language: searchParams.get('language') || 'all',
      visitType: searchParams.get('visitType') || 'all',
      minRating: searchParams.get('minRating') || '0',
      feeRange: searchParams.get('feeRange') || 'all',
      paymentMethod: searchParams.get('paymentMethod') || 'all',
      clinicId: searchParams.get('clinicId') || 'all',
      sort: searchParams.get('sort') || 'best_match',
      mock: searchParams.get('mock') || '',
    };
  }, [searchParams]);

  // Fetch providers whenever filters or retryNonce change
  useEffect(() => {
    let isCancelled = false;

    const executeFetch = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchProviders(filters, { mock: filters.mock });
        if (!isCancelled) {
          setProviders(response.data);
          setSponsoredProviders(response.sponsored);
          setTotalCount(response.total);
          setEmergencyAlert(response.emergency);
          setConditionMatch(response.conditionMatch);
          setLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || 'An unexpected error occurred while fetching providers.');
          setLoading(false);
        }
      }
    };

    executeFetch();

    return () => {
      isCancelled = true;
    };
  }, [filters, retryNonce]);

  // Update a single filter or multiple filters
  const updateFilters = useCallback(
    (newParams) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(newParams).forEach(([key, val]) => {
            if (val === null || val === undefined || val === '' || val === 'all' || val === '0') {
              next.delete(key);
            } else {
              next.set(key, String(val));
            }
          });
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  // Set free text search + location
  const setSearch = useCallback(
    (query, location = 'all') => {
      updateFilters({
        q: query,
        location: location === 'all' ? null : location,
        condition: null, // Clear explicit condition override on fresh search
      });
    },
    [updateFilters]
  );

  // Quick switch of specialty (e.g. from condition banner)
  const setSpecialty = useCallback(
    (specId) => {
      updateFilters({ specialty: specId });
    },
    [updateFilters]
  );

  // Clear specific condition banner
  const clearCondition = useCallback(() => {
    updateFilters({ condition: null, specialty: null });
  }, [updateFilters]);

  // Clear all filters except mock if set
  const clearAllFilters = useCallback(() => {
    const mock = searchParams.get('mock');
    const fresh = new URLSearchParams();
    if (mock) fresh.set('mock', mock);
    setSearchParams(fresh, { replace: true });
  }, [searchParams, setSearchParams]);

  // Remove individual filter
  const removeFilter = useCallback(
    (key) => {
      updateFilters({ [key]: null });
    },
    [updateFilters]
  );

  // Trigger manual retry
  const retry = useCallback(() => {
    setRetryNonce((n) => n + 1);
  }, []);

  // Compute active filter chips with human-readable localized labels
  const activeFilterChips = useMemo(() => {
    const chips = [];

    if (filters.q) {
      chips.push({
        key: 'q',
        label: `"${filters.q}"`,
      });
    }

    if (filters.location && filters.location !== 'all') {
      const loc = LOCATIONS.find((l) => l.id === filters.location);
      if (loc) {
        chips.push({
          key: 'location',
          label: lang === 'ar' ? loc.ar : loc.en,
        });
      }
    }

    if (filters.specialty && filters.specialty !== 'all') {
      const spec = SPECIALTIES.find((s) => s.id === filters.specialty);
      if (spec) {
        chips.push({
          key: 'specialty',
          label: lang === 'ar' ? spec.ar : spec.en,
        });
      }
    }

    if (filters.availability && filters.availability !== 'all') {
      const availMap = {
        today: t('filters.availToday'),
        tomorrow: t('filters.availTomorrow'),
        week: t('filters.availWeek'),
      };
      if (availMap[filters.availability]) {
        chips.push({
          key: 'availability',
          label: availMap[filters.availability],
        });
      }
    }

    if (filters.visitType && filters.visitType !== 'all') {
      const visitMap = {
        clinic: t('filters.inClinic'),
        online: t('filters.online'),
        home: t('filters.home'),
      };
      if (visitMap[filters.visitType]) {
        chips.push({
          key: 'visitType',
          label: visitMap[filters.visitType],
        });
      }
    }

    if (filters.minRating && Number(filters.minRating) > 0) {
      chips.push({
        key: 'minRating',
        label: `★ ${filters.minRating}+`,
      });
    }

    if (filters.feeRange && filters.feeRange !== 'all') {
      const feeMap = {
        'under-300': t('filters.feeUnder300'),
        '300-450': t('filters.fee300To450'),
        'above-450': t('filters.feeAbove450'),
      };
      if (feeMap[filters.feeRange]) {
        chips.push({
          key: 'feeRange',
          label: feeMap[filters.feeRange],
        });
      }
    }

    if (filters.language && filters.language !== 'all') {
      chips.push({
        key: 'language',
        label: filters.language,
      });
    }

    if (filters.paymentMethod && filters.paymentMethod !== 'all') {
      const payMap = {
        cash: t('filters.cash'),
        card: t('filters.card'),
        wallet: t('filters.wallet'),
      };
      if (payMap[filters.paymentMethod]) {
        chips.push({
          key: 'paymentMethod',
          label: payMap[filters.paymentMethod],
        });
      }
    }

    if (filters.clinicId && filters.clinicId !== 'all') {
      const clinic = providers.find((c) => String(c.id) === String(filters.clinicId) || c.clinicId === filters.clinicId);
      chips.push({
        key: 'clinicId',
        label: clinic ? (lang === 'ar' ? clinic.nameAr : clinic.nameEn) : `Clinic #${filters.clinicId}`,
      });
    }

    return chips;
  }, [filters, lang, t, providers]);

  return {
    filters,
    loading,
    error,
    providers,
    sponsoredProviders,
    totalCount,
    emergencyAlert,
    conditionMatch,
    activeFilterChips,
    activeFiltersCount: activeFilterChips.length,
    updateFilters,
    setSearch,
    setSpecialty,
    clearCondition,
    clearAllFilters,
    removeFilter,
    retry,
  };
};

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n/useI18n.jsx';
import { LOCATIONS } from '../data/conditions.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { fetchSuggestions } from '../api/providersApi.js';
import { SuggestionList } from './SuggestionList.jsx';

export const SearchBar = ({
  initialQuery = '',
  initialLocation = 'all',
  onSearch,
  className = '',
}) => {
  const { lang, t } = useI18n();
  const navigate = useNavigate();

  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [suggestions, setSuggestions] = useState({ conditions: [], doctors: [], clinics: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef(null);
  const lastSubmittedRef = useRef(initialQuery);
  const debouncedQuery = useDebounce(query, 300);

  // Sync state if props change externally (e.g. url navigation)
  useEffect(() => {
    setQuery(initialQuery);
    lastSubmittedRef.current = initialQuery;
  }, [initialQuery]);

  useEffect(() => {
    setLocation(initialLocation);
  }, [initialLocation]);

  // Live debounced search when user types (FR-SAN-09, FR-SAN-10)
  useEffect(() => {
    if (debouncedQuery !== lastSubmittedRef.current) {
      lastSubmittedRef.current = debouncedQuery;
      if (onSearch) {
        onSearch(debouncedQuery, location);
      }
    }
  }, [debouncedQuery]);

  // Fetch debounced autocomplete suggestions (FR-SAN-10)
  useEffect(() => {
    let active = true;

    if (!debouncedQuery || debouncedQuery.trim().length < 2) {
      setSuggestions({ conditions: [], doctors: [], clinics: [] });
      setIsOpen(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    fetchSuggestions(debouncedQuery)
      .then((data) => {
        if (active) {
          setSuggestions(data);
          const hasItems = data.conditions.length > 0 || data.doctors.length > 0 || data.clinics.length > 0;
          setIsOpen(hasItems);
          setIsSearching(false);
        }
      })
      .catch(() => {
        if (active) setIsSearching(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setIsOpen(false);
    lastSubmittedRef.current = query;
    if (onSearch) {
      onSearch(query, location);
    }
  };

  const handleSelectCondition = (condition) => {
    setIsOpen(false);
    const condName = lang === 'ar' ? condition.ar : condition.en;
    setQuery(condName);
    lastSubmittedRef.current = condName;
    if (onSearch) {
      // Trigger search with condition ID and mapped specialty
      onSearch(condName, location, {
        conditionId: condition.id,
        specialtyId: condition.specialtyId,
      });
    }
  };

  const handleSelectDoctor = (doctor) => {
    setIsOpen(false);
    navigate(`/providers/${doctor.id}`);
  };

  const handleSelectClinic = (clinic) => {
    setIsOpen(false);
    navigate(`/clinics/${clinic.id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col md:flex-row items-stretch bg-white rounded-2xl shadow-soft border border-slate-200/90 focus-within:ring-2 focus-within:ring-teal-600 focus-within:border-teal-600 transition-all p-1.5 gap-1.5"
      >
        {/* Main Search Input */}
        <div className="relative flex-1 flex items-center min-w-0">
          <label htmlFor="main-search-input" className="sr-only">
            {t('search.placeholder')}
          </label>
          <div className="ps-3.5 pe-2 text-slate-400 flex items-center pointer-events-none">
            {isSearching ? (
              <Loader2 className="w-5 h-5 text-teal-600 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </div>
          <input
            id="main-search-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (debouncedQuery.length >= 2) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={t('search.placeholder')}
            autoComplete="off"
            className="w-full py-3 pe-8 text-sm sm:text-base text-slate-900 bg-transparent placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
                lastSubmittedRef.current = '';
                if (onSearch) {
                  onSearch('', location);
                }
              }}
              aria-label={t('search.clearSearch')}
              className="absolute end-2 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Location Dropdown */}
        <div className="relative flex items-center border-t md:border-t-0 md:border-s border-slate-200 ps-2 md:w-64">
          <label htmlFor="location-select" className="sr-only">
            {t('filters.location')}
          </label>
          <MapPin className="w-4 h-4 text-teal-600 ms-2 flex-shrink-0" />
          <select
            id="location-select"
            value={location}
            onChange={(e) => {
              const newLoc = e.target.value;
              setLocation(newLoc);
              if (onSearch) {
                onSearch(query, newLoc);
              }
            }}
            className="w-full py-3 ps-2 pe-8 text-xs sm:text-sm font-medium text-slate-700 bg-transparent focus:outline-none cursor-pointer appearance-none truncate"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {lang === 'ar' ? loc.ar : loc.en}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
            ▼
          </div>
        </div>

        {/* Search Submit Button */}
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm sm:text-base shadow-sm transition-transform active:scale-98 touch-target focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-700"
        >
          <Search className="w-4 h-4 stroke-[2.5]" />
          <span>{t('search.button')}</span>
        </button>
      </form>

      {/* Autocomplete Suggestions Popup */}
      <SuggestionList
        suggestions={suggestions}
        isOpen={isOpen}
        activeIndex={activeIndex}
        onSelectCondition={handleSelectCondition}
        onSelectDoctor={handleSelectDoctor}
        onSelectClinic={handleSelectClinic}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

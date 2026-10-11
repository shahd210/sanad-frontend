import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShieldCheck, Globe, PhoneCall, Bug, Stethoscope, Building2, ChevronDown, Check } from 'lucide-react';
import { useI18n } from '../i18n/useI18n.jsx';

export const Navbar = () => {
  const { lang, toggleLang, t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMockMenuOpen, setIsMockMenuOpen] = useState(false);

  const currentMock = searchParams.get('mock') || 'normal';

  const setMockState = (mockVal) => {
    setIsMockMenuOpen(false);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!mockVal || mockVal === 'normal') {
        next.delete('mock');
      } else {
        next.set('mock', mockVal);
      }
      return next;
    });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-teal-700 to-teal-500 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight group-hover:text-teal-700 transition-colors">
                {t('brand.name')}
              </span>
              <span className="hidden sm:block text-[11px] font-semibold text-teal-700 -mt-1 tracking-wide">
                {t('brand.tagline')}
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <Link to="/" className="hover:text-teal-700 transition-colors flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              <span>{t('nav.findDoctors')}</span>
            </Link>
            <Link to="/clinics/11" className="hover:text-teal-700 transition-colors flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-teal-600" />
              <span>{t('nav.clinics')}</span>
            </Link>
          </nav>

          {/* Right Controls: Dev Mock Toggle + Emergency Quick Button + Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dev Mock Mode Dropdown (UI State testing) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMockMenuOpen(!isMockMenuOpen)}
                aria-expanded={isMockMenuOpen}
                aria-haspopup="true"
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors touch-target ${
                  currentMock !== 'normal'
                    ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-400'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
                title="Force UI States for Demo & Testing"
              >
                <Bug className="w-3.5 h-3.5 text-teal-700" />
                <span className="hidden lg:inline">{t('nav.devMock')}:</span>
                <span className="capitalize">{currentMock}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {isMockMenuOpen && (
                <div className="absolute end-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 z-50 animate-fadeIn">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                    Force UI States
                  </div>
                  {[
                    { id: 'normal', label: 'Normal Data' },
                    { id: 'error', label: 'Force Error (?mock=error)' },
                    { id: 'empty', label: 'Force Empty (?mock=empty)' },
                    { id: 'slow', label: 'Slow Network (?mock=slow)' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setMockState(mode.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-start transition-colors ${
                        currentMock === mode.id
                          ? 'bg-teal-50 text-teal-900 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{mode.label}</span>
                      {currentMock === mode.id && <Check className="w-3.5 h-3.5 text-teal-700" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Emergency Hotline Button */}
            <a
              href="tel:123"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition-colors touch-target"
            >
              <PhoneCall className="w-3.5 h-3.5 fill-red-600" />
              <span>{t('brand.emergencyBadge')}</span>
            </a>

            {/* Bilingual Switcher (Arabic RTL <-> English LTR) */}
            <button
              type="button"
              onClick={toggleLang}
              aria-label="Switch Language (العربية / English)"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100/80 text-teal-900 text-xs font-bold border border-teal-200 shadow-2xs transition-transform active:scale-95 touch-target focus-visible:ring-2 focus-visible:ring-teal-600"
            >
              <Globe className="w-4 h-4 text-teal-600" />
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

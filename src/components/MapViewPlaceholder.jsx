import React, { useState } from 'react';
import { MapPin, Navigation, Building2, Star, ExternalLink, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/useI18n.jsx';

export const MapViewPlaceholder = ({ providers = [] }) => {
  const { lang, t } = useI18n();
  const [selectedDoctor, setSelectedDoctor] = useState(providers[0] || null);

  // Egyptian coordinates relative pins layout simulation
  const pins = providers.slice(0, 10).map((doc, idx) => {
    // Generate deterministic mockup positions across map canvas
    const xPositions = [28, 42, 60, 35, 70, 50, 65, 30, 48, 55];
    const yPositions = [35, 45, 30, 65, 50, 75, 40, 55, 60, 25];
    return {
      doc,
      top: `${yPositions[idx % yPositions.length]}%`,
      left: `${xPositions[idx % xPositions.length]}%`,
    };
  });

  return (
    <div className="relative w-full h-[650px] bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden shadow-soft flex flex-col md:flex-row">
      {/* Map visual canvas */}
      <div className="relative flex-1 bg-[#E8ECEF] overflow-hidden min-h-[350px]">
        {/* Subtle SVG Grid & River Nile Graphic */}
        <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Nile River representation curve */}
          <path
            d="M 280,650 Q 290,450 250,300 T 260,0"
            fill="none"
            stroke="#93C5FD"
            strokeWidth="38"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>

        {/* Cairo / Alexandria Map Labels */}
        <div className="absolute top-6 start-8 text-xs font-bold text-slate-500 uppercase tracking-widest pointer-events-none">
          Alexandria & Mediterranean
        </div>
        <div className="absolute top-1/2 start-1/3 text-xs font-bold text-slate-500 uppercase tracking-widest pointer-events-none">
          Greater Cairo & Giza
        </div>

        {/* Doctor Pins */}
        {pins.map(({ doc, top, left }) => {
          const isSelected = selectedDoctor?.id === doc.id;
          const name = lang === 'ar' ? doc.nameAr : doc.nameEn;

          return (
            <div
              key={doc.id}
              style={{ top, left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer transition-transform hover:scale-110"
              onClick={() => setSelectedDoctor(doc)}
            >
              <div
                className={`relative flex items-center justify-center p-2 rounded-full shadow-lg transition-all ${
                  isSelected
                    ? 'bg-teal-600 text-white ring-4 ring-teal-200 scale-125'
                    : 'bg-white text-teal-800 border-2 border-teal-600 hover:bg-teal-50'
                }`}
                title={name}
              >
                <MapPin className="w-5 h-5 fill-current" />
              </div>
              <div className="mt-1 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-[10px] font-semibold text-white text-center whitespace-nowrap shadow-xs pointer-events-none max-w-[110px] truncate">
                {name}
              </div>
            </div>
          );
        })}

        {/* Map Legend Banner */}
        <div className="absolute bottom-4 start-4 end-4 md:end-auto bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-sm border border-slate-200 text-xs text-slate-600 max-w-sm">
          <p className="font-bold text-slate-900 mb-0.5">{t('mapPlaceholder.title')}</p>
          <p className="text-[11px] text-slate-500">{t('mapPlaceholder.legend')}</p>
        </div>
      </div>

      {/* Selected Doctor Side Preview Panel */}
      {selectedDoctor && (
        <div className="w-full md:w-80 bg-white border-t md:border-t-0 md:border-s border-slate-200 p-4 sm:p-5 flex flex-col justify-between z-30">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                {lang === 'ar' ? selectedDoctor.specialtyAr : selectedDoctor.specialtyEn}
              </span>
              <button
                type="button"
                onClick={() => setSelectedDoctor(null)}
                aria-label="Close preview"
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <img
                src={selectedDoctor.avatar}
                alt={selectedDoctor.nameEn}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
              />
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-slate-900 truncate">
                  {lang === 'ar' ? selectedDoctor.nameAr : selectedDoctor.nameEn}
                </h4>
                <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{selectedDoctor.rating}</span>
                  <span className="text-slate-400 font-normal">({selectedDoctor.reviewCount})</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 mb-4">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                <span className="truncate">
                  {lang === 'ar' ? selectedDoctor.clinicNameAr : selectedDoctor.clinicNameEn}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                <span>{lang === 'ar' ? selectedDoctor.areaAr : selectedDoctor.areaEn}</span>
              </div>
              <div className="text-xs text-slate-500 pt-1">
                {selectedDoctor.addressEn}
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 mb-4 text-xs flex justify-between items-center">
              <span className="text-slate-500">{t('card.consultationFee')}:</span>
              <span className="font-extrabold text-teal-800 text-sm">
                {selectedDoctor.fee} {selectedDoctor.currency}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Link
              to={`/providers/${selectedDoctor.id}`}
              className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors touch-target"
            >
              <span>{t('card.viewProfile')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

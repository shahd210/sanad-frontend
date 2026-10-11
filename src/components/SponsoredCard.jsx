import React from 'react';
import { Sparkles, Megaphone, ChevronRight } from 'lucide-react';
import { useI18n } from '../i18n/useI18n.jsx';
import { ProviderCard } from './ProviderCard.jsx';

export const SponsoredSection = ({ sponsoredProviders = [], onBookAppointment }) => {
  const { lang, t } = useI18n();

  if (!sponsoredProviders || sponsoredProviders.length === 0) return null;

  return (
    <section
      aria-label={t('results.sponsoredTitle')}
      className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50/50 via-teal-50/30 to-amber-50/40 border border-amber-200/80"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-amber-500 text-white flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-sm font-bold text-amber-950 uppercase tracking-wide">
            {t('results.sponsoredTitle')}
          </h2>
          <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300">
            {t('card.sponsored')}
          </span>
        </div>
        <p className="hidden md:block text-[11px] text-slate-500 font-medium">
          {t('results.sponsoredNotice')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {sponsoredProviders.map((doctor) => (
          <ProviderCard
            key={doctor.id}
            provider={doctor}
            isSponsored={true}
            onBookAppointment={onBookAppointment}
          />
        ))}
      </div>
    </section>
  );
};

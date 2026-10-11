import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Building2, Calendar, Globe, Clock, ChevronRight, Award, Megaphone } from 'lucide-react';
import { useI18n } from '../i18n/useI18n.jsx';
import { VerifiedBadge } from './VerifiedBadge.jsx';
import { RatingStars } from './RatingStars.jsx';
import { SlotChips } from './SlotChips.jsx';

export const ProviderCard = ({
  provider,
  isDeemphasized = false,
  isSponsored = false,
  onBookAppointment,
}) => {
  const { lang, t } = useI18n();
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState(null);

  const isCardSponsored = isSponsored || Boolean(provider?.sponsored);
  const name = lang === 'ar' ? provider.nameAr : provider.nameEn;
  const title = lang === 'ar' ? provider.titleAr : provider.titleEn;
  const specialty = lang === 'ar' ? provider.specialtyAr : provider.specialtyEn;
  const clinicName = lang === 'ar' ? provider.clinicNameAr : provider.clinicNameEn;
  const area = lang === 'ar' ? provider.areaAr : provider.areaEn;

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    if (onBookAppointment) {
      onBookAppointment(provider, slot);
    }
  };

  return (
    <article
      className={`group relative bg-white rounded-2xl border transition-all duration-200 p-4 sm:p-5 ${
        isDeemphasized
          ? 'opacity-60 grayscale-30 border-dashed border-red-200 hover:opacity-100 hover:grayscale-0'
          : isCardSponsored
          ? 'border-amber-300/80 shadow-soft hover:shadow-soft-lg hover:border-amber-400 bg-gradient-to-b from-amber-50/15 via-white to-white'
          : 'border-slate-200/90 shadow-soft hover:shadow-soft-lg hover:border-teal-300'
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Doctor Photo & Badges */}
        <div className="flex sm:flex-col items-center sm:items-start gap-3 flex-shrink-0">
          <div className="relative">
            <img
              src={provider.avatar}
              alt={name}
              loading="lazy"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-slate-100 shadow-2xs group-hover:border-teal-200 transition-colors"
            />
            {provider.verified && (
              <div className="absolute -bottom-1 -end-1 sm:hidden">
                <VerifiedBadge size="sm" showLabel={false} />
              </div>
            )}
          </div>

          <div className="sm:hidden flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                {specialty}
              </span>
              {provider.verified && <VerifiedBadge size="sm" showLabel={false} />}
              {isCardSponsored && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                  <Megaphone className="w-2.5 h-2.5 text-amber-700 flex-shrink-0" />
                  <span>{lang === 'ar' ? (provider.sponsoredLabelAr || 'طبيب مميز') : (provider.sponsoredLabelEn || 'Sponsored')}</span>
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-slate-900 truncate mt-0.5">
              <Link to={`/providers/${provider.id}`} className="hover:text-teal-700 inline-link">
                {name}
              </Link>
            </h3>
            <div className="mt-1">
              <RatingStars rating={provider.rating} reviewCount={provider.reviewCount} size="sm" />
            </div>
          </div>
        </div>

        {/* Doctor Info Section */}
        <div className="flex-1 min-w-0">
          <div className="hidden sm:flex items-center justify-between gap-3 mb-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200/60">
                {specialty}
              </span>
              {provider.verified && <VerifiedBadge size="sm" showLabel={true} />}
            </div>

            {/* Right side: Sponsored Badge + Rating Stars cleanly separated with gap-3 */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {isCardSponsored && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100/90 px-2.5 py-1 rounded-lg border border-amber-300 shadow-2xs">
                  <Megaphone className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                  <span>{lang === 'ar' ? (provider.sponsoredLabelAr || 'طبيب مميز برعاية') : (provider.sponsoredLabelEn || 'Sponsored Specialist')}</span>
                </span>
              )}
              <RatingStars rating={provider.rating} reviewCount={provider.reviewCount} size="sm" />
            </div>
          </div>

          <h3 className="hidden sm:block text-lg font-bold text-slate-900 truncate">
            <Link to={`/providers/${provider.id}`} className="hover:text-teal-700 inline-link">
              {name}
            </Link>
          </h3>

          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 mb-2 font-medium">
            {title}
          </p>

          {/* Quick Meta details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600 mb-3">
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
              <span>{t('card.yearsExperience', { years: provider.experienceYears })}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
              <Link to={`/clinics/${provider.clinicId}`} className="hover:underline truncate inline-link">
                {clinicName}
              </Link>
            </div>

            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
              <span className="truncate">{area}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
              <span>{t('card.waitingTime', { minutes: provider.waitingTimeMinutes })}</span>
            </div>
          </div>

          {/* Fee & Languages */}
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">{t('card.consultationFee')}:</span>
              <span className="text-sm font-extrabold text-teal-800">
                {provider.fee} {provider.currency}
              </span>
            </div>

            <div className="flex items-center gap-1 text-slate-500">
              <Globe className="w-3 h-3 text-slate-400" />
              <span>{provider.languages.join(', ')}</span>
            </div>
          </div>

          {/* Slots & CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <div className="flex-1">
              <div className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{t('card.nextAvailable')}</span>
              </div>
              <SlotChips
                slots={provider.availableSlots}
                selectedSlot={selectedSlot}
                onSelectSlot={handleSlotSelect}
                maxDisplay={2}
              />
            </div>

            <div className="flex items-center gap-2 pt-2 sm:pt-0">
              <Link
                to={`/providers/${provider.id}`}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-teal-700 transition-colors inline-flex items-center justify-center touch-target"
              >
                <span>{t('card.viewProfile')}</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  if (provider.availableSlots && provider.availableSlots.length > 0) {
                    handleSlotSelect(provider.availableSlots[0]);
                  } else if (onBookAppointment) {
                    onBookAppointment(provider, null);
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all active:scale-98 inline-flex items-center justify-center gap-1.5 touch-target focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-700"
              >
                <span>{t('card.bookNow')}</span>
                <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Building2,
  Calendar,
  Clock,
  Globe,
  Award,
  ShieldCheck,
  CheckCircle,
  CreditCard,
  Phone,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useI18n } from '../i18n/useI18n.jsx';
import { fetchProviderById } from '../api/providersApi.js';
import { VerifiedBadge } from '../components/VerifiedBadge.jsx';
import { RatingStars } from '../components/RatingStars.jsx';
import { SlotChips } from '../components/SlotChips.jsx';
import { Tabs } from '../components/Tabs.jsx';
import { ProviderDetailsSkeleton } from '../components/Skeletons.jsx';
import { ErrorState } from '../components/ErrorState.jsx';
import { Toast } from '../components/Toast.jsx';

export const ProviderDetailsPage = () => {
  const { id } = useParams();
  const { lang, t } = useI18n();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [toastInfo, setToastInfo] = useState({ isOpen: false, title: '', message: '' });

  const loadProvider = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProviderById(id);
      setProvider(data);
      if (data.availableSlots && data.availableSlots.length > 0) {
        setSelectedSlot(data.availableSlots[0]);
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProvider();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleConfirmBooking = () => {
    const docName = lang === 'ar' ? provider.nameAr : provider.nameEn;
    const slotText = selectedSlot
      ? `${lang === 'ar' ? selectedSlot.dayAr : selectedSlot.dayEn} @ ${selectedSlot.time}`
      : 'Regular queue';

    setToastInfo({
      isOpen: true,
      title: t('details.outOfScopeNotice'),
      message: `${t('details.outOfScopeMsg')} [${docName} - ${slotText}]`,
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 py-8">
        <ProviderDetailsSkeleton />
      </main>
    );
  }

  if (error || !provider) {
    return (
      <main className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            <span>{t('details.back')}</span>
          </Link>
          <ErrorState message={error || 'Provider not found'} onRetry={loadProvider} />
        </div>
      </main>
    );
  }

  const name = lang === 'ar' ? provider.nameAr : provider.nameEn;
  const title = lang === 'ar' ? provider.titleAr : provider.titleEn;
  const specialty = lang === 'ar' ? provider.specialtyAr : provider.specialtyEn;
  const clinicName = lang === 'ar' ? provider.clinicNameAr : provider.clinicNameEn;
  const area = lang === 'ar' ? provider.areaAr : provider.areaEn;
  const about = lang === 'ar' ? provider.aboutAr : provider.aboutEn;
  const educationList = lang === 'ar' ? provider.educationAr : provider.educationEn;

  const tabs = [
    { id: 'overview', label: t('details.tabs.overview') },
    { id: 'services', label: t('details.tabs.services') },
    { id: 'location', label: t('details.tabs.location') },
    { id: 'reviews', label: t('details.tabs.reviews') },
    { id: 'availability', label: t('details.tabs.availability') },
  ];

  return (
    <main className="min-h-screen bg-slate-50/70 pb-28 lg:pb-16">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            <span>{t('details.back')}</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Doctor Main Header Card */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 shadow-soft mb-6">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative">
              <img
                src={provider.avatar}
                alt={name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-slate-50 shadow-soft"
              />
              {provider.verified && (
                <div className="absolute -bottom-2 -end-2">
                  <VerifiedBadge size="lg" showLabel={false} />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                  {specialty}
                </span>
                {provider.verified && <VerifiedBadge size="md" showLabel={true} />}
                <span className="text-xs text-slate-500 font-medium">
                  {t('details.licenseNum', { num: provider.licenseNumber })}
                </span>
              </div>

              <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 mb-1">
                {name}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 mb-3 font-medium leading-relaxed">
                {title}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 pt-2 border-t border-slate-100">
                <RatingStars rating={provider.rating} reviewCount={provider.reviewCount} size="md" />

                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-teal-600" />
                  <span>{t('card.yearsExperience', { years: provider.experienceYears })}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-teal-600" />
                  <Link to={`/clinics/${provider.clinicId}`} className="hover:underline font-semibold text-teal-800">
                    {clinicName}
                  </Link>
                </div>

                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  <span>{area}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Layout: Tabs & Information (2 Cols) + Sticky Booking Card (1 Col) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs Navigation */}
            <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-soft">
                  <h2 className="text-base font-bold text-slate-900 mb-3">
                    {t('details.aboutDoctor')}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                    {about}
                  </p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-soft">
                  <h2 className="text-base font-bold text-slate-900 mb-3">
                    {t('details.education')}
                  </h2>
                  <ul className="space-y-2.5">
                    {educationList.map((edu, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                        <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span>{edu}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-soft">
                  <h2 className="text-base font-bold text-slate-900 mb-3">
                    {t('details.languagesSpoken')}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {provider.languages.map((langItem) => (
                      <span
                        key={langItem}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5"
                      >
                        <Globe className="w-3.5 h-3.5 text-slate-500" />
                        <span>{langItem}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SERVICES & FEES */}
            {activeTab === 'services' && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-soft animate-fadeIn">
                <h2 className="text-base font-bold text-slate-900 mb-4">
                  {t('details.availableServices')}
                </h2>
                <div className="divide-y divide-slate-100">
                  {provider.services?.map((svc, idx) => {
                    const svcName = lang === 'ar' ? svc.nameAr : svc.nameEn;
                    return (
                      <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                        <span className="text-sm font-semibold text-slate-800">{svcName}</span>
                        <span className="text-sm font-extrabold text-teal-800 whitespace-nowrap">
                          {svc.fee} {provider.currency}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: CLINIC & LOCATION */}
            {activeTab === 'location' && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-soft space-y-5 animate-fadeIn">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 mb-1">{clinicName}</h2>
                    <p className="text-sm text-slate-500">
                      {lang === 'ar' ? provider.addressAr : provider.addressEn}
                    </p>
                  </div>
                  <Link
                    to={`/clinics/${provider.clinicId}`}
                    className="px-4 py-2 rounded-xl bg-teal-50 text-teal-800 font-bold text-xs hover:bg-teal-100 transition-colors whitespace-nowrap"
                  >
                    View Clinic
                  </Link>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-teal-600 flex-shrink-0" />
                  <div className="text-xs text-slate-600">
                    <p className="font-bold text-slate-800">
                      {lang === 'ar' ? 'أوقات الانتظار المتوقعة' : 'Estimated Waiting Time'}
                    </p>
                    <p>{t('card.waitingTime', { minutes: provider.waitingTimeMinutes })}</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: REVIEWS & RATINGS */}
            {activeTab === 'reviews' && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-soft space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-base font-bold text-slate-900 mb-1">
                    {t('details.reviewsHeader')}
                  </h2>
                  <p className="text-xs text-slate-500">{t('details.reviewsSub')}</p>
                </div>

                {/* Rating Distribution Breakdown */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="text-center sm:text-start flex-shrink-0">
                    <div className="text-4xl font-black text-slate-900">{provider.rating}</div>
                    <RatingStars rating={provider.rating} size="sm" />
                    <div className="text-xs text-slate-500 mt-1">
                      {provider.reviewCount} {lang === 'ar' ? 'تقييم كشف' : 'patient reviews'}
                    </div>
                  </div>

                  {/* Star Distribution Bars */}
                  <div className="flex-1 w-full space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const pct = provider.starDistribution?.[star] || 0;
                      return (
                        <div key={star} className="flex items-center gap-2 text-xs">
                          <span className="w-4 text-slate-500 font-bold">{star}★</span>
                          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-8 text-end text-slate-500 font-medium">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Verified Visit Reviews List */}
                <div className="space-y-4">
                  {provider.reviews?.map((rev) => {
                    const patientName = lang === 'ar' ? rev.patientNameAr : rev.patientName;
                    const comment = lang === 'ar' ? rev.commentAr : rev.commentEn;

                    return (
                      <div
                        key={rev.id}
                        className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">{patientName}</span>
                            {rev.verifiedVisit && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                                <CheckCircle className="w-3 h-3 text-teal-600" />
                                <span>{t('details.verifiedVisit')}</span>
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400">{rev.date}</span>
                        </div>

                        <RatingStars rating={rev.rating} size="sm" />
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                          {comment}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 5: AVAILABILITY FULL SCHEDULE */}
            {activeTab === 'availability' && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-soft space-y-4 animate-fadeIn">
                <h2 className="text-base font-bold text-slate-900">
                  {t('details.tabs.availability')}
                </h2>
                <p className="text-xs text-slate-500">
                  {lang === 'ar'
                    ? 'اختر الميعاد المناسب لك لتأكيد الحجز الفوري.'
                    : 'Choose your preferred date and time slot for immediate booking.'}
                </p>

                <div className="pt-2">
                  <SlotChips
                    slots={provider.availableSlots}
                    selectedSlot={selectedSlot}
                    onSelectSlot={setSelectedSlot}
                    maxDisplay={10}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Desktop Sticky Booking Card */}
          <aside className="hidden lg:block lg:col-span-1 sticky top-24">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-soft">
              <h3 className="text-base font-bold text-slate-900 mb-1">
                {t('details.bookSidebar.title')}
              </h3>

              <div className="flex items-baseline justify-between py-3 border-b border-slate-100 mb-4">
                <span className="text-xs text-slate-500 font-medium">
                  {t('details.bookSidebar.feeLabel')}
                </span>
                <span className="text-xl font-black text-teal-800">
                  {provider.fee} {provider.currency}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    {t('details.bookSidebar.selectSlot')}
                  </label>
                  <SlotChips
                    slots={provider.availableSlots}
                    selectedSlot={selectedSlot}
                    onSelectSlot={setSelectedSlot}
                    maxDisplay={4}
                  />
                </div>

                <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 space-y-1">
                  <p className="flex items-center gap-1.5 text-teal-700 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{t('details.bookSidebar.instantConfirmation')}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-500">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Pay at clinic or via Card / Wallet</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleConfirmBooking}
                className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-transform active:scale-98 touch-target focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-700 flex items-center justify-center gap-2"
              >
                <span>{t('details.bookSidebar.confirmBtn')}</span>
                <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Sticky Bottom Booking Bar */}
      <div className="lg:hidden fixed bottom-0 start-0 end-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3.5 z-40 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[11px] text-slate-500 block">
            {t('details.bookSidebar.feeLabel')}
          </span>
          <span className="text-lg font-black text-teal-800">
            {provider.fee} {provider.currency}
          </span>
        </div>

        <button
          type="button"
          onClick={handleConfirmBooking}
          className="flex-1 py-3 px-5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-sm touch-target"
        >
          {selectedSlot ? `${t('details.bookSidebar.confirmBtn')} (${selectedSlot.time})` : t('card.bookNow')}
        </button>
      </div>

      {/* Toast Reminder for Mock Scope */}
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

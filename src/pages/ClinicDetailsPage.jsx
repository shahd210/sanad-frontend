import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  Images,
  Stethoscope,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useI18n } from '../i18n/useI18n.jsx';
import { fetchClinicById } from '../api/providersApi.js';
import { VerifiedBadge } from '../components/VerifiedBadge.jsx';
import { ProviderCard } from '../components/ProviderCard.jsx';
import { ErrorState } from '../components/ErrorState.jsx';

export const ClinicDetailsPage = () => {
  const { id } = useParams();
  const { lang, t } = useI18n();

  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadClinic = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchClinicById(id);
      setClinic(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClinic();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
          <div className="h-64 bg-slate-200 rounded-3xl" />
          <div className="h-40 bg-white rounded-3xl border border-slate-200" />
        </div>
      </main>
    );
  }

  if (error || !clinic) {
    return (
      <main className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:underline mb-4">
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            <span>{t('clinicDetails.back')}</span>
          </Link>
          <ErrorState message={error || 'Clinic not found'} onRetry={loadClinic} />
        </div>
      </main>
    );
  }

  const name = lang === 'ar' ? clinic.nameAr : clinic.nameEn;
  const address = lang === 'ar' ? clinic.addressAr : clinic.addressEn;
  const description = lang === 'ar' ? clinic.descriptionAr : clinic.descriptionEn;
  const servicesList = lang === 'ar' ? clinic.servicesAr : clinic.servicesEn;

  return (
    <main className="min-h-screen bg-slate-50/70 pb-16">
      {/* Top Banner Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            <span>{t('clinicDetails.back')}</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Clinic Header Banner */}
        <section className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-soft">
          <div className="relative h-56 sm:h-72 w-full">
            <img
              src={clinic.image}
              alt={name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />
            <div className="absolute bottom-6 start-6 end-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-600 text-white">
                  {clinic.governorate}
                </span>
                {clinic.verified && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-white">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
                    <span>{t('clinicDetails.verified')}</span>
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-black">{name}</h1>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-teal-400" />
                <span>{address}</span>
              </p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 text-slate-700">
              <Phone className="w-4 h-4 text-teal-600" />
              <div>
                <span className="text-slate-400 block text-[11px]">{t('clinicDetails.hotline')}:</span>
                <span className="font-bold text-slate-900">{clinic.phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-slate-700">
              <Clock className="w-4 h-4 text-teal-600" />
              <div>
                <span className="text-slate-400 block text-[11px]">{t('clinicDetails.operatingHours')}:</span>
                <span className="font-bold text-slate-900">
                  {clinic.branches?.[0] ? (lang === 'ar' ? clinic.branches[0].hoursAr : clinic.branches[0].hoursEn) : '24/7'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-slate-700">
              <Building2 className="w-4 h-4 text-teal-600" />
              <div>
                <span className="text-slate-400 block text-[11px]">{t('clinicDetails.emergency')}:</span>
                <span className="font-bold text-red-600">{clinic.emergencyHotline}</span>
              </div>
            </div>
          </div>
        </section>

        {/* About & Services */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-soft">
              <h2 className="text-base font-bold text-slate-900 mb-3">About the Center</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
            </div>

            {/* Services */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-soft">
              <h2 className="text-base font-bold text-slate-900 mb-3">
                {t('clinicDetails.services')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {servicesList.map((svc, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                    <span>{svc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Doctors in this clinic */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-soft space-y-4">
              <h2 className="text-base font-bold text-slate-900">
                {t('clinicDetails.doctorsInClinic')}
              </h2>
              <div className="space-y-4">
                {clinic.doctors?.map((doc) => (
                  <ProviderCard key={doc.id} provider={doc} />
                ))}
              </div>
            </div>
          </div>

          {/* Branches & Photo Gallery Column */}
          <div className="space-y-6">
            {/* Branches */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-soft">
              <h2 className="text-base font-bold text-slate-900 mb-3">
                {t('clinicDetails.branches')}
              </h2>
              <div className="space-y-3">
                {clinic.branches?.map((branch) => (
                  <div key={branch.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
                    <h4 className="font-bold text-slate-900 text-sm mb-1">
                      {lang === 'ar' ? branch.nameAr : branch.nameEn}
                    </h4>
                    <p className="text-slate-600 mb-1">
                      {lang === 'ar' ? branch.areaAr : branch.areaEn}
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      {lang === 'ar' ? branch.hoursAr : branch.hoursEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo Gallery */}
            {clinic.gallery && clinic.gallery.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-soft">
                <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                  <Images className="w-4 h-4 text-teal-600" />
                  <span>{t('clinicDetails.photoGallery')}</span>
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {clinic.gallery.map((imgUrl, i) => (
                    <img
                      key={i}
                      src={imgUrl}
                      alt="Clinic facility"
                      className="w-full h-24 rounded-xl object-cover border border-slate-200"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

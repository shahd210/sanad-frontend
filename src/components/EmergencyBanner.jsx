import React from 'react';
import { AlertOctagon, PhoneCall, Hospital, ShieldAlert } from 'lucide-react';
import { useI18n } from '../i18n/useI18n.jsx';

export const EmergencyBanner = ({ matchedTerm = null, onDismiss }) => {
  const { t } = useI18n();

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="relative mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-lg border-2 border-red-400 overflow-hidden"
    >
      {/* Background aesthetic emergency watermark */}
      <div className="absolute -end-6 -bottom-6 opacity-10 pointer-events-none">
        <ShieldAlert className="w-48 h-48" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex-shrink-0 animate-pulse">
            <AlertOctagon className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block px-2.5 py-0.5 rounded text-xs font-black tracking-wider uppercase bg-white text-red-700">
                {t('emergencyBanner.title')}
              </span>
              {matchedTerm && (
                <span className="text-xs text-red-100 font-medium">
                  (Matched: &ldquo;{matchedTerm}&rdquo;)
                </span>
              )}
            </div>
            <p className="text-sm sm:text-base font-semibold text-white leading-relaxed max-w-2xl">
              {t('emergencyBanner.message')}
            </p>
            <p className="text-xs text-red-100/90 mt-1">
              {t('emergencyBanner.deemphasizedNotice')}
            </p>
          </div>
        </div>

        {/* Emergency Direct Action CTAs */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto">
          <a
            href="tel:123"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-red-700 font-bold text-sm sm:text-base shadow hover:bg-red-50 transition-transform active:scale-95 touch-target focus-visible:ring-4 focus-visible:ring-white"
          >
            <PhoneCall className="w-5 h-5 fill-red-600" />
            <span>{t('emergencyBanner.action')}</span>
          </a>

          <a
            href="#emergency-clinics"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-red-800/80 hover:bg-red-900 border border-red-400 text-white font-medium text-xs sm:text-sm transition-colors touch-target"
          >
            <Hospital className="w-4 h-4" />
            <span>{t('emergencyBanner.actionSecondary')}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

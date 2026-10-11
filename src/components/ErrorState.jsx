import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useI18n } from '../i18n/useI18n.jsx';

export const ErrorState = ({ message, onRetry }) => {
  const { t } = useI18n();

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="p-8 sm:p-12 text-center bg-white rounded-3xl border border-red-200 shadow-soft max-w-xl mx-auto my-6"
    >
      <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-100 shadow-2xs">
        <AlertTriangle className="w-8 h-8" />
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
        {t('states.errorTitle')}
      </h3>

      <p className="text-sm text-slate-600 mb-6 leading-relaxed max-w-md mx-auto">
        {message || 'A network error occurred while loading data from the server.'}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-sm transition-transform active:scale-95 touch-target focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-700"
      >
        <RefreshCw className="w-4 h-4" />
        <span>{t('states.errorRetry')}</span>
      </button>
    </div>
  );
};

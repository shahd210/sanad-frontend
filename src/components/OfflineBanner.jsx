import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus.js';
import { useI18n } from '../i18n/useI18n.jsx';

export const OfflineBanner = () => {
  const isOnline = useOnlineStatus();
  const { t } = useI18n();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-amber-600 text-white px-4 py-2.5 text-center text-xs sm:text-sm font-semibold sticky top-0 z-50 shadow-md flex items-center justify-center gap-2"
    >
      <WifiOff className="w-4 h-4 animate-pulse flex-shrink-0" />
      <span>{t('states.offlineTitle')}: {t('states.offlineMessage')}</span>
    </div>
  );
};

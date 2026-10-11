import React, { useEffect } from 'react';
import { Info, CheckCircle2, AlertCircle, X } from 'lucide-react';

export const Toast = ({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  duration = 4500,
}) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const typeConfig = {
    info: {
      bg: 'bg-teal-900 text-white',
      icon: <Info className="w-5 h-5 text-teal-300 flex-shrink-0" />,
    },
    success: {
      bg: 'bg-emerald-900 text-white',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-900 text-white',
      icon: <AlertCircle className="w-5 h-5 text-amber-300 flex-shrink-0" />,
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 start-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md animate-slideUp"
    >
      <div className={`flex items-start gap-3 p-4 rounded-2xl shadow-2xl ${config.bg} border border-white/10`}>
        {config.icon}
        <div className="flex-1 min-w-0">
          {title && <h4 className="text-sm font-bold text-white mb-0.5">{title}</h4>}
          <p className="text-xs text-slate-200 leading-relaxed">{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

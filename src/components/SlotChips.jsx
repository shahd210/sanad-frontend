import React from 'react';
import { Clock, CalendarX } from 'lucide-react';
import { useI18n } from '../i18n/useI18n.jsx';

export const SlotChips = ({ slots = [], selectedSlot = null, onSelectSlot, maxDisplay = 3 }) => {
  const { lang, t } = useI18n();

  if (!slots || slots.length === 0) {
    return (
      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 text-xs">
        <CalendarX className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <span>{t('card.noSlots')}</span>
      </div>
    );
  }

  const displayedSlots = slots.slice(0, maxDisplay);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {displayedSlots.map((slot) => {
        const isSelected = selectedSlot?.id === slot.id;
        const dayLabel = lang === 'ar' ? slot.dayAr : slot.dayEn;

        return (
          <button
            key={slot.id}
            type="button"
            onClick={() => onSelectSlot && onSelectSlot(slot)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isSelected
                ? 'bg-teal-700 text-white shadow-sm ring-2 ring-teal-500 ring-offset-1'
                : 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200/80 active:scale-95'
            }`}
          >
            <Clock className="w-3.5 h-3.5 opacity-75" />
            <span>{dayLabel}</span>
            <span className="font-semibold">{slot.time}</span>
          </button>
        );
      })}
      {slots.length > maxDisplay && (
        <span className="text-xs text-slate-500 font-medium px-1">
          +{slots.length - maxDisplay}
        </span>
      )}
    </div>
  );
};

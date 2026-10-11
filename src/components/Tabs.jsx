import React, { useRef } from 'react';

export const Tabs = ({ tabs = [], activeTab, onTabChange, className = '' }) => {
  const tabListRef = useRef(null);

  const handleKeyDown = (e, index) => {
    let newIndex = index;
    if (e.key === 'ArrowRight') {
      newIndex = (index + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      newIndex = (index - 1 + tabs.length) % tabs.length;
    }

    if (newIndex !== index) {
      e.preventDefault();
      onTabChange(tabs[newIndex].id);
      const buttons = tabListRef.current?.querySelectorAll('button[role="tab"]');
      if (buttons && buttons[newIndex]) {
        buttons[newIndex].focus();
      }
    }
  };

  return (
    <div
      ref={tabListRef}
      role="tablist"
      aria-label="Content tabs"
      className={`flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-2xl overflow-x-auto scrollbar-none ${className}`}
    >
      {tabs.map((tab, idx) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all touch-target ${
              isActive
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

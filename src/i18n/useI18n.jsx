// i18n Context and Custom Hook for Arabic (RTL) & English (LTR)
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import arData from './ar.json';
import enData from './en.json';

const I18nContext = createContext(null);

const translations = {
  ar: arData,
  en: enData,
};

export const I18nProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sanad_lang');
      if (saved && (saved === 'ar' || saved === 'en')) return saved;
    }
    return 'ar'; // Default Egyptian Arabic
  });

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = dir;
      document.documentElement.lang = lang;
      localStorage.setItem('sanad_lang', lang);
    }
  }, [lang, dir]);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  }, []);

  const t = useCallback(
    (keyPath, variables = {}) => {
      const keys = keyPath.split('.');
      let result = translations[lang];

      for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
          result = result[k];
        } else {
          // Fallback to English if missing in target
          let fallback = translations.en;
          for (const fbKey of keys) {
            if (fallback && typeof fallback === 'object' && fbKey in fallback) {
              fallback = fallback[fbKey];
            } else {
              return keyPath;
            }
          }
          result = fallback;
          break;
        }
      }

      if (typeof result === 'string') {
        let text = result;
        Object.keys(variables).forEach((varKey) => {
          text = text.replace(new RegExp(`{{${varKey}}}`, 'g'), variables[varKey]);
        });
        return text;
      }

      return keyPath;
    },
    [lang]
  );

  /**
   * Helper to pick localized property (e.g. nameEn vs nameAr)
   */
  const getLocalized = useCallback(
    (item, baseKey) => {
      if (!item) return '';
      const cap = baseKey.charAt(0).toUpperCase() + baseKey.slice(1);
      if (lang === 'ar') {
        return item[`${baseKey}Ar`] || item[`${baseKey}En`] || item[baseKey] || '';
      }
      return item[`${baseKey}En`] || item[`${baseKey}Ar`] || item[baseKey] || '';
    },
    [lang]
  );

  const value = useMemo(
    () => ({
      lang,
      setLang,
      dir,
      toggleLang,
      t,
      getLocalized,
    }),
    [lang, dir, toggleLang, t, getLocalized]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

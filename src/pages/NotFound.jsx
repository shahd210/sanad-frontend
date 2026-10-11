import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';
import { useI18n } from '../i18n/useI18n.jsx';

export const NotFound = () => {
  const { lang, t } = useI18n();

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-slate-50">
      <div className="text-center max-w-md bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/90 shadow-soft">
        <div className="w-16 h-16 rounded-3xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4 border border-teal-100">
          <FileQuestion className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">404 - Page Not Found</h1>
        <p className="text-sm text-slate-500 mb-6">
          {lang === 'ar'
            ? 'عفواً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.'
            : 'The medical directory page you are looking for does not exist.'}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-sm transition-transform active:scale-95 touch-target"
        >
          <Home className="w-4 h-4" />
          <span>{lang === 'ar' ? 'العودة لصفحة البحث' : 'Back to Provider Search'}</span>
        </Link>
      </div>
    </main>
  );
};

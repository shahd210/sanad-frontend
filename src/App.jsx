import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { I18nProvider, useI18n } from './i18n/useI18n.jsx';
import { OfflineBanner } from './components/OfflineBanner.jsx';
import { Navbar } from './components/Navbar.jsx';
import { SearchPage } from './pages/SearchPage.jsx';
import { ProviderDetailsPage } from './pages/ProviderDetailsPage.jsx';
import { ClinicDetailsPage } from './pages/ClinicDetailsPage.jsx';
import { NotFound } from './pages/NotFound.jsx';
import { ShieldCheck, PhoneCall, HeartHandshake } from 'lucide-react';

const Footer = () => {
  const { lang, t } = useI18n();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-black text-lg">
              <ShieldCheck className="w-6 h-6 text-teal-400" />
              <span>{t('brand.name')}</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {lang === 'ar'
                ? 'منصة الوساطة الطبية المعتمدة للربط بين المرضى وأطباء مصر الموثقين بنقابة الأطباء ووزارة الصحة.'
                : 'SANAD is Egypt’s verified healthcare mediation platform connecting patients with certified medical consultants.'}
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">
              {lang === 'ar' ? 'روابط سريعة' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-teal-400 transition-colors inline-link">
                  {t('nav.findDoctors')}
                </Link>
              </li>
              <li>
                <Link to="/clinics/11" className="hover:text-teal-400 transition-colors inline-link">
                  {t('nav.clinics')}
                </Link>
              </li>
              <li>
                <a href="tel:123" className="hover:text-red-400 transition-colors inline-link">
                  {t('nav.emergency')} (123)
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">
              {lang === 'ar' ? 'الامتثال الطبي والأمان' : 'Compliance & Safety'}
            </h4>
            <p className="text-slate-400 leading-relaxed mb-2">
              {lang === 'ar'
                ? 'جميع الأطباء والمراكز الطبية تخضع للتحقق من التراخيص الرسمية وسجلات النقابة.'
                : 'All healthcare providers are manually vetted against Egyptian Medical Syndicate credentials.'}
            </p>
            <p className="text-slate-500 text-[10px]">
              Strictly public data. Zero private patient health records exposed.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">
              {lang === 'ar' ? 'طوارئ الإسعاف المصرية' : 'Egyptian Ambulance Service'}
            </h4>
            <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-900/60 text-red-200">
              <div className="flex items-center gap-2 font-bold text-white mb-1">
                <PhoneCall className="w-4 h-4 text-red-400" />
                <span>123</span>
              </div>
              <p className="text-[11px] text-red-200/80">
                {lang === 'ar'
                  ? 'اتصل بالرقم ١٢٣ فوراً في حالات الطوارئ وتهديد الحياة.'
                  : 'Call 123 immediately for life-threatening medical emergencies.'}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} SANAD Healthcare Mediation Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span>WCAG 2.1 AA Compliant</span>
            <span>•</span>
            <span>RTL / LTR Bilingual</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const App = () => {
  return (
    <I18nProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col font-sans">
          <OfflineBanner />
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<SearchPage />} />
              <Route path="/providers/:id" element={<ProviderDetailsPage />} />
              <Route path="/clinics/:id" element={<ClinicDetailsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </I18nProvider>
  );
};

export default App;

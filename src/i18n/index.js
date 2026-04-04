import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { setLearnerLang } from '../lib/api.js';
import arCommon from './locales/ar/common.json';
import enCommon from './locales/en/common.json';

export function syncDocumentFromLanguage(lng) {
  const code = (lng || 'ar').split('-')[0];
  document.documentElement.lang = code === 'en' ? 'en' : 'ar';
  document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
  if (i18n.isInitialized) {
    document.title = i18n.t('meta.title');
  }
}

function persistLearnerLang(lng) {
  const code = (lng || 'ar').split('-')[0];
  setLearnerLang(code === 'en' ? 'en' : 'ar');
}

i18n.on('languageChanged', (lng) => {
  syncDocumentFromLanguage(lng);
  persistLearnerLang(lng);
});

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon },
      ar: { common: arCommon },
    },
    fallbackLng: 'ar',
    defaultNS: 'common',
    ns: ['common'],
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: 'learnerLang',
    },
    interpolation: { escapeValue: false },
  })
  .then(() => {
    syncDocumentFromLanguage(i18n.language);
    persistLearnerLang(i18n.language);
  });

export default i18n;

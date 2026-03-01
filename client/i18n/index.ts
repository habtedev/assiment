import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

import am from './am.json';
import en from './en.json';


// Language configuration
export const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'am', name: 'አማርኛ', flag: '🇪🇹', dir: 'ltr' },
] as const;

export type LanguageCode = typeof languages[number]['code'];

// Resources type for better TypeScript support
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof en;
    };
  }
}

// Initialize i18n with production settings
i18n
  .use(Backend) // For lazy loading translations
  .use(LanguageDetector) // Auto-detect user language
  .use(initReactI18next)
  .init({
    resources: {
      am: { translation: am },
      en: { translation: en },
    },
    fallbackLng: 'en',
    debug: false,
    
    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'university-language-preference',
      caches: ['localStorage'],
    },
    
    // Interpolation options
    interpolation: {
      escapeValue: false,
      format: (value, format) => {
        if (format === 'uppercase') return value.toUpperCase();
        if (format === 'lowercase') return value.toLowerCase();
        if (format === 'capitalize') return value.charAt(0).toUpperCase() + value.slice(1);
        return value;
      },
    },
    
    // React-specific options
    react: {
      useSuspense: false, // Prevents hydration issues
      bindI18n: 'languageChanged',
      bindI18nStore: 'added',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
    },
    
    // Performance optimizations
    load: 'languageOnly',
    preload: ['en'],
    lowerCaseLng: true,
    nonExplicitSupportedLngs: true,
  });

// Set HTML dir attribute on language change
i18n.on('languageChanged', (lng) => {
  const language = languages.find(l => l.code === lng);
  if (language) {
    document.documentElement.dir = language.dir;
    document.documentElement.lang = lng;
  }
});

export default i18n;
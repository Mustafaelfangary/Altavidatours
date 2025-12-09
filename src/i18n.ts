// src/lib/i18n.ts
import { useLanguage } from '@/context/language-context';

// Import translation files
import enCommon from '@/messages/en/common.json';

const translations = {
  en: { common: enCommon },
  // Other languages will be added here
  ar: { common: {} },
  es: { common: {} },
  fr: { common: {} },
  ru: { common: {} },
  pt: { common: {} }
};

export function useTranslation(namespace = 'common') {
  const { language } = useLanguage();
  
  const t = (key: string, options?: Record<string, any>) => {
    // Get the translation
    let translation = translations[language]?.[namespace]?.[key] || 
                     translations['en']?.[namespace]?.[key] || 
                     key;

    // Handle variable substitution
    if (options) {
      Object.entries(options).forEach(([k, v]) => {
        translation = translation.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
      });
    }

    return translation;
  };

  return { t, i18n: { language } };
}
'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  const toggleLanguage = () => {
    setLocale(locale === 'en' ? 'ar' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-ocean-blue/10 transition-colors"
      aria-label="Switch Language"
      title={locale === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      <Globe className="w-5 h-5 text-ocean-blue" />
      <span className="text-sm font-medium text-gray-700">
        {locale === 'en' ? 'العربية' : 'English'}
      </span>
    </button>
  );
}

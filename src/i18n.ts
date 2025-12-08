import { getRequestConfig } from 'next-intl/server';
import { ReactNode } from 'react';
import React from 'react';

// Supported locales
export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];

// Main i18n configuration
export default getRequestConfig(async ({ locale = 'en' }) => {
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
    timeZone: 'Africa/Cairo',
    defaultTranslationValues: {
      strong: (chunks: ReactNode) => React.createElement('strong', null, chunks),
      em: (chunks: ReactNode) => React.createElement('em', null, chunks)
    }
  };
});
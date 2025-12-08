'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { translateText } from '@/lib/translate-api';

export function useTranslate(text: string | undefined | null): string {
  const { locale } = useLanguage();
  const [translatedText, setTranslatedText] = useState(text || '');

  useEffect(() => {
    if (!text) {
      setTranslatedText('');
      return;
    }

    if (locale === 'en') {
      setTranslatedText(text);
      return;
    }

    let isMounted = true;

    translateText(text, locale).then(translated => {
      if (isMounted) {
        setTranslatedText(translated);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [text, locale]);

  return translatedText;
}

// Hook for translating arrays
export function useTranslateArray(texts: string[]): string[] {
  const { locale } = useLanguage();
  const [translatedTexts, setTranslatedTexts] = useState<string[]>(texts);

  useEffect(() => {
    if (locale === 'en') {
      setTranslatedTexts(texts);
      return;
    }

    let isMounted = true;

    Promise.all(texts.map(text => translateText(text, locale))).then(translated => {
      if (isMounted) {
        setTranslatedTexts(translated);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [texts, locale]);

  return translatedTexts;
}
